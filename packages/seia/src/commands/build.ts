import { Args, Command, Flags } from '@oclif/core'
import { build } from '../build.js'

export default class Build extends Command {
	static override args = {}

	static override description =
		'Bundle the project along with SSR and RSC assets'

	static override examples = [
		'<%= config.bin %> <%= command.id %>',
	]

	static override flags = {}

	public async run(): Promise<void> {
		const {} = await this.parse(Build)

		await build()
	}
}
