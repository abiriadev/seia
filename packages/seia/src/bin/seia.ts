#!/usr/bin/env node
import { execute } from '@oclif/core'
import { performance } from 'node:perf_hooks'

globalThis.__SEIA_START_TIME = performance.now()

await execute({ dir: import.meta.url })
