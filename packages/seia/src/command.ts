import { ResolvedSeiaConfig, resolveSeiaConfig } from './config.js'
import { Command } from '@oclif/core'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { parse } from 'toml'

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
		const config = parse(configString)
		this.resolvedConfig = resolveSeiaConfig(config)
	}

	protected async catch(err: Error & { exitCode?: number }): Promise<any> {
		return super.catch(err)
	}

	protected async finally(_?: Error): Promise<any> {
		return super.finally(_)
	}
}
