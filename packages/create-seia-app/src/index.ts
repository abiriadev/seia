import { cp, rm, writeFile } from 'node:fs/promises'

import { Args, Command, Flags } from '@oclif/core'
import { Liquid } from 'liquidjs'
import prompts from 'prompts'
import walkdir from 'walkdir'

interface Context {
	name: string
	package: string
}

export default class Index extends Command {
	static override args = {
		name: Args.string({ description: 'Name for the new project' }),
	}

	static override description = 'Create a new Seia project'

	static override examples = ['<%= config.bin %>', '<%= config.bin %> <Name>']

	static override flags = {}

	static templateExtension = '.liquid'

	static normalizeProjectName(name: string) {
		return name.trim()
	}

	async render(path: string, context: Context) {
		const liquid = new Liquid()

		// TODO: use Promise.all to parallelize
		for (const template of await walkdir.async(path, {
			filter: (_, files) =>
				files.filter(file => file.endsWith(Index.templateExtension)),
		})) {
			await writeFile(
				template.slice(0, -Index.templateExtension.length),
				await liquid.renderFile(template, context),
			)

			await rm(template)
		}
	}

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(Index)

		const { name, ts } = await prompts([
			{
				type: args.name ? null : 'text',
				name: 'name',
				message: 'Project name:',
				initial: 'seia-app',
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

		const context = {
			name,
			package: name,
		}

		await this.render(name, context)

		const indent = '  '

		console.log(
			`\n${indent}Created project ${name} with ${template} template!\n\n${indent}$ cd ${name}\n${indent}$ npm install\n${indent}$ npm run build\n${indent}$ npm run start\n\n${indent}Happy hacking! 🚀`,
		)
	}
}
