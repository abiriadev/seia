import { Command } from '@oclif/core'
import {
	ResolvedSeiaConfig,
	resolveSeiaConfig,
} from './config.js'

export abstract class SeiaCommand extends Command {
	static enableJsonFlag = true

	protected resolvedConfig!: ResolvedSeiaConfig

	public async init(): Promise<void> {
		await super.init()
		this.resolvedConfig = resolveSeiaConfig({})
	}

	protected async catch(
		err: Error & { exitCode?: number },
	): Promise<any> {
		return super.catch(err)
	}

	protected async finally(_?: Error): Promise<any> {
		return super.finally(_)
	}
}
