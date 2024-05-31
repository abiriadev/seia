import { performance } from 'node:perf_hooks'

import { execute } from '@oclif/core'

globalThis.__SEIA_START_TIME = performance.now()

await execute({ dir: import.meta.url })
