import './webpack-global.js'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import {
	parentPort,
	workerData,
	type TransferListItem,
} from 'node:worker_threads'
import { jsx } from 'react/jsx-runtime'
import { AnchorId, mustParseAnchorId } from './anchor.js'

const { path, anchor } = mustParseAnchorId(
	workerData as AnchorId,
)

const component = await import(path)

const rs = renderToReadableStream(
	jsx(component[anchor], {}),
	new Proxy(
		{},
		{
			get(_, anchorId: string) {
				const { anchor } =
					mustParseAnchorId(anchorId)
				const id = 'C.js'
				return {
					id,
					name: anchor,
					chunks: [id],
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
