import { cp } from 'node:fs/promises'

import { Args, Command, Flags } from '@oclif/core'
import prompts from 'prompts'

export default class Index extends Command {
	static override args = {
		name: Args.string({ description: 'Name for the new project' }),
	}

	static override description = 'Create a new Seia project'

	static override examples = ['<%= config.bin %>', '<%= config.bin %> <Name>']

	static override flags = {}

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(Index)

		const { name, ts } = await prompts([
			{
				type: args.name ? null : 'text',
				name: 'name',
				message: 'Project name:',
				initial: '',
			},
			{
				type: 'toggle',
				name: 'ts',
				message: 'Use TypeScript?',
				active: 'yes',
				inactive: 'no',
				initial: true,
			},
		])

		const template = ts ? 'typescript' : 'javascript'

		await cp(`${import.meta.dirname}/../templates/${template}`, name, {
			recursive: true,
		})

		const indent = '  '

		console.log(
			`\n${indent}Created project ${name} with ${template} template!\n\n${indent}$ cd ${name}\n${indent}$ npm install\n${indent}$ npm run build\n${indent}$ npm run start\n\n${indent}Happy hacking! 🚀`,
		)
	}
}
