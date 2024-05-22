import './webpack-global.js'
import { Hono } from 'hono'
import { serve as nodeServe } from '@hono/node-server'
import { cwd } from 'node:process'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { logger } from 'hono/logger'
import { ComponentType } from 'react'
import { renderRscDom } from './renderer.js'
import {
	renderToString,
	renderToReadableStream,
} from 'react-dom/server.edge'
import { jsx } from 'react/jsx-runtime'

let entry: null | { App: ComponentType } = null

const app = new Hono()

app.use(logger())

/** @jsxImportSource hono/jsx */
app.get('/', async c => {
	const entryFile = pathToFileURL(
		join(cwd(), './dist/App.js'),
	).href

	const [worker, dom] = await renderRscDom(entryFile)

	const ren = await renderToReadableStream(dom)

	const __html = await new Response(ren).text()

	await worker.terminate()

	return c.html(
		(
			<html>
				<head>
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>Seia SSR</title>
				</head>
				<body>
					<div
						id="root"
						dangerouslySetInnerHTML={{ __html }}
					/>
				</body>
			</html>
		).toString(),
	)
})

export const serve = async () => {
	console.log(`http://localhost:5314`)

	nodeServe({
		fetch: app.fetch,
		port: 5314,
	})
}
