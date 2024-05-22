import './webpack-global.js'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import {
	parentPort,
	workerData,
	type TransferListItem,
} from 'node:worker_threads'
import { jsx } from 'react/jsx-runtime'

const component = await import(workerData.componentUrl)

const rs = renderToReadableStream(
	jsx(component.App, {}),
	new Proxy(
		{},
		{
			get(_target, encodedId: string) {
				console.log('builder', _target)
			},
		},
	),
)

parentPort?.postMessage(rs, [
	rs as unknown as TransferListItem,
])

parentPort?.on('message', console.log)
