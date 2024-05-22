import { createFromReadableStream } from 'react-server-dom-webpack/client.edge'
import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { ReactNode } from 'react'

const workerUrl = join(
	fileURLToPath(new URL('.', import.meta.url)),
	'worker.js',
)

const execWorker = async (
	componentUrl: string,
): Promise<[Worker, ReadableStream]> =>
	new Promise((resolve, reject) => {
		const worker = new Worker(workerUrl, {
			workerData: {
				componentUrl,
			},
			execArgv: ['-C', 'react-server'],
		})

		worker.on('error', async e => {
			await worker.terminate()
			reject(e)
		})
		worker.on('message', rs => resolve([worker, rs]))
	})

export const renderRscDom = async (
	componentUrl: string,
): Promise<ReactNode> => {
	const [worker, rs] = await execWorker(componentUrl)

	const dom = await createFromReadableStream(rs, {
		ssrManifest: {
			moduleMap: new Proxy(
				{},
				{
					get(target, p, receiver) {
						console.log(target)
					},
				},
			),
			moduleLoading: null,
		},
	})

	await worker.terminate()

	return dom
}
