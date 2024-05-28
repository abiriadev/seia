import { Args, Flags } from '@oclif/core'
import {
	SeiaConfigSchema,
	extendResolvedSeiaConfig,
} from '../config.js'
import { serve } from '../server.js'
import { SeiaCommand } from '../command.js'

export default class Start extends SeiaCommand {
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
		const {
			flags: { port },
		} = await this.parse(Start)

		return await serve(
			extendResolvedSeiaConfig(this.resolvedConfig, {
				port,
			}),
		)
	}
}
