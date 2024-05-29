import { join } from 'node:path'
import {
	type TransferListItem,
	parentPort,
	workerData,
} from 'node:worker_threads'

import { type ComponentType } from 'react'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import { jsx } from 'react/jsx-runtime'

import { type ResolvedSeiaConfig } from './config.js'
import { changeExtension } from './utils-path.js'
import { type AnchorId, mustParseAnchorId, trimPrefix } from './utils.js'
import './webpack-global.js'

const {
	anchorId,
	config: {
		root,
		paths: { src, dist, rsc },
	},
} = workerData as {
	// RelativePath, always RSC
	anchorId: AnchorId
	config: ResolvedSeiaConfig
}

const { path, anchor } = mustParseAnchorId(anchorId)

const componentPath = join(root, dist, rsc, path)

const component = (
	(await import(componentPath)) as Record<string, ComponentType>
)[anchor]

const rs = renderToReadableStream(
	jsx(component, {}),
	new Proxy(
		{},
		{
			get(_, anchorId: string) {
				const { path, anchor } = mustParseAnchorId(anchorId)

				const relativePath =
					'.' +
					changeExtension(trimPrefix(path, join(root, src)), '.js')

				return {
					id: relativePath,
					name: anchor,
					chunks: [`${relativePath}#${anchor}`],
					async: true,
				}
			},
		},
	),
)

parentPort?.postMessage(rs, [rs as unknown as TransferListItem])

// eslint-disable-next-line @typescript-eslint/no-empty-function
parentPort?.on('message', () => {})
