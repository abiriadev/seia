import { Args, Command, Flags } from '@oclif/core'
import { SeiaConfigSchema } from '../config.js'
import { serve } from '../server.js'

export default class Start extends Command {
	static override args = {}

	static override description =
		'Starts SSR and RSC server. The project should be compiled with `seia build` first.'

	static override examples = [
		'<%= config.bin %> <%= command.id %>',
	]

	static override flags = {
		port: Flags.integer({
			char: 'p',
			description:
				SeiaConfigSchema.shape.port.description,
		}),
	}

	public async run(): Promise<void> {
		const { flags } = await this.parse(Start)

		return await serve()
	}
}
