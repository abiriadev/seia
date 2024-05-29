#!/usr/bin/env node

import { performance } from 'node:perf_hooks'

globalThis.__SEIA_START_TIME = performance.now()

import { execute } from '@oclif/core'

await execute({ dir: import.meta.url })
