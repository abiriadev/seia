import './webpack-global.js'
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import { parentPort, workerData } from 'node:worker_threads'
import { jsx } from 'react/jsx-runtime'
;(async () => {
	const component = await import(workerData.componentUrl)

	const rs = renderToReadableStream(
		jsx(component.App, {}),
		{},
	)

	const text = await new Response(rs).text()

	parentPort?.postMessage(text)
})()
