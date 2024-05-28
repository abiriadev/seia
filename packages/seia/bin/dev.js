#!/usr/bin/env node

import { performance } from 'node:perf_hooks'

globalThis.__SEIA_START_TIME = performance.now()

// eslint-disable-next-line n/shebang
import { execute } from '@oclif/core'

await execute({ development: true, dir: import.meta.url })
