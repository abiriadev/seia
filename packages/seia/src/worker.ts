import './webpack-global.js'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import {
	parentPort,
	workerData,
	type TransferListItem,
} from 'node:worker_threads'
import { join } from 'node:path'
import { jsx } from 'react/jsx-runtime'
import { AnchorId, mustParseAnchorId } from './anchor.js'
import { ResolvedSeiaConfig } from './config.js'
import { trimPrefix } from './utils.js'

const {
	anchorId,
	config: {
		root,
		paths: { dist, rsc },
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

				const relativePath = trimPrefix(
					path,
					config.root,
				)

				console.log('rel', relativePath)

				return {
					id: path,
					name: anchor,
					chunks: [`${path}#${anchor}`],
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
