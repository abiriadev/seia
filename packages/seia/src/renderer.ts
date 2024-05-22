import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const workerUrl = join(
	fileURLToPath(new URL('.', import.meta.url)),
	'worker.js',
)

export const renderRsc = async (
	componentUrl: string,
): Promise<string> =>
	new Promise((resolve, reject) => {
		const worker = new Worker(workerUrl, {
			workerData: {
				componentUrl,
			},
			execArgv: ['-C', 'react-server'],
		})

		worker.on('error', reject)
		worker.on('message', resolve)
	})
