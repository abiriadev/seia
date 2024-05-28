import './webpack-global.js'
import { Hono } from 'hono'
import { serve as nodeServe } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { cwd } from 'node:process'
import { join } from 'node:path'
import { logger } from 'hono/logger'
import {
	renderRscDom,
	renderRscPayloadStream,
} from './renderer.js'
import { renderToReadableStream } from 'react-dom/server.edge'
import { ResolvedSeiaConfig } from './config.js'

const app = new Hono()

app.use(logger())

app.use(
	'/@seia/*',
	serveStatic({
		root: './dist',
		rewriteRequestPath: path =>
			path.replace(/^\/@seia/, ''),
	}),
)

app.get('/@seia', async c => {
	const entryFile = join(cwd(), './dist/rsc/App.js#App')

	const [worker, stream] =
		await renderRscPayloadStream(entryFile)

	const __rsc = await new Response(stream).text()

	await worker.terminate()

	return c.text(__rsc)
})

/** @jsxImportSource hono/jsx */
app.get('/', async c => {
	const entryFile = join(cwd(), './dist/rsc/App.js#App')

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
					<script
						type="module"
						src="/@seia/client.js"
					/>
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

export const serve = async ({
	port,
}: ResolvedSeiaConfig) => {
	console.log(`http://localhost:${port}`)

	nodeServe({
		fetch: app.fetch,
		port,
	})
}
