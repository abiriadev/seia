import { build } from '../build.js'
import { SeiaCommand } from '../command.js'
import { Args, Flags } from '@oclif/core'

export default class Build extends SeiaCommand {
	static override args = {}

	static override description =
		'Bundle the project along with SSR and RSC assets.'

	static override examples = ['<%= config.bin %> <%= command.id %>']

	static override flags = {}

	public async run(): Promise<void> {
		const {} = await this.parse(Build)

		await build(this.resolvedConfig)
	}
}
