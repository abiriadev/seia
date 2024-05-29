import './webpack-global.js'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import {
	parentPort,
	workerData,
	type TransferListItem,
} from 'node:worker_threads'
import { join } from 'node:path'
import { jsx } from 'react/jsx-runtime'
import { ResolvedSeiaConfig } from './config.js'
import {
	changeExtension,
	trimPrefix,
	AnchorId,
	mustParseAnchorId,
} from './utils.js'

const {
	anchorId,
	config: {
		root,
		paths: { src, dist, rsc },
	},
} = workerData as {
	// relativePath, always RSC
	anchorId: AnchorId
	config: ResolvedSeiaConfig
}

const { path, anchor } = mustParseAnchorId(anchorId)

const componentPath = join(root, dist, rsc, path)

const component = (await import(componentPath))[anchor]

const rs = renderToReadableStream(
	jsx(component, {}),
	new Proxy(
		{},
		{
			get(_, anchorId: string) {
				const { path, anchor } =
					mustParseAnchorId(anchorId)

				const relativePath =
					'.' +
					changeExtension(
						trimPrefix(path, join(root, src)),
						'.js',
					)

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

parentPort?.postMessage(rs, [
	rs as unknown as TransferListItem,
])

parentPort?.on('message', () => {})
