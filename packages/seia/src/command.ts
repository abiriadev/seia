import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'

import { Command } from '@oclif/core'
import { parse } from 'toml'

import {
	type ResolvedSeiaConfig,
	type SeiaConfig,
	resolveSeiaConfig,
} from './config.js'

export abstract class SeiaCommand extends Command {
	static enableJsonFlag = true

	protected resolvedConfig!: ResolvedSeiaConfig

	public async init(): Promise<void> {
		await super.init()
		let configString
		try {
			configString = (await readFile(join(cwd(), 'seia.toml'))).toString()
		} catch {
			configString = ''
		}

		const rawConfig = parse(configString) as SeiaConfig
		this.resolvedConfig = resolveSeiaConfig(rawConfig)
	}

	protected async catch(error: Error & { exitCode?: number }): Promise<any> {
		return super.catch(error)
	}

	protected async finally(_?: Error): Promise<any> {
		return super.finally(_)
	}
}
