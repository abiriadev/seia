#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { exit } from 'node:process'
import { match } from 'ts-pattern'
import { build } from './build.js'
import { serve } from './server.js'

const { positionals } = parseArgs({
	allowPositionals: true,
})

const cmd = positionals[0]

if (!cmd) {
	console.log(`Usage: seia build`)
	exit()
}

match(cmd)
	.with('build', async () => {
		return await build()
	})
	.with('start', async () => {
		return await serve()
	})
	.otherwise(() => {
		console.log(`Unknown command: ${cmd}`)
		exit(1)
	})
