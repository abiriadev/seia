import './webpack-global.js'
import { Hono } from 'hono'
import { performance } from 'node:perf_hooks'
import { serve as nodeServe } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import {
	renderRscPayloadStream,
	renderRscPayloadStreamToDom,
} from './renderer.js'
import { renderToReadableStream } from 'react-dom/server.edge'
import { ResolvedSeiaConfig } from './config.js'
import { changeExtension, trimPrefix } from './utils.js'
import chalk from 'chalk'
import {
	seiaBanner,
	seiaBgChalk,
	seiaChalk,
} from './constants.js'
import { version } from './package.js'

const injectGlobal = (rscPayload: string) =>
	`globalThis.__SEIA_RSC_PAYLOAD = \`${rscPayload}\``

/** @jsxImportSource hono/jsx */
export const serve = async (config: ResolvedSeiaConfig) => {
	const {
		paths: { entry, dist, rsc },
		serve: { port },
	} = config

	const app = new Hono()

	app.use(logger())

	app.use(
		'/@seia/*',
		serveStatic({
			root: dist,
			rewriteRequestPath: path =>
				trimPrefix(path, '/@seia'),
		}),
	)

	app.get('/', async c => {
		const entryFile =
			changeExtension(entry, '.js') + '#App'

		const [worker, stream] =
			await renderRscPayloadStream(entryFile, config)

		const [rscPayloadStream, domStream] = stream.tee()

		const rscPayload = await new Response(
			rscPayloadStream,
		).text()

		const dom = await renderRscPayloadStreamToDom(
			domStream,
			config,
		)

		const __html = await new Response(
			await renderToReadableStream(dom),
		).text()

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
							dangerouslySetInnerHTML={{
								__html,
							}}
						/>
						<script
							dangerouslySetInnerHTML={{
								__html: injectGlobal(
									rscPayload,
								),
							}}
						/>
					</body>
				</html>
			).toString(),
		)
	})

	console.log()
	console.log(
		seiaChalk(
			seiaBanner
				.split('\n')
				.map(line => `  ${line}`)
				.join('\n'),
		),
	)
	console.log()
	console.log(
		`  ${seiaBgChalk.black(' SEIA.js ')} ${seiaChalk(`v${version}`)}  ${chalk.dim(`ready in ${chalk.bold(Math.ceil(performance.now() - globalThis.__SEIA_START_TIME))} ms`)}`,
	)
	console.log()
	console.log(
		`  ${chalk.green('➜')} ${chalk.bold('Local')} \t${chalk.blue(`http://localhost:${port}`)}`,
	)

	nodeServe({
		fetch: app.fetch,
		port,
	})
}
