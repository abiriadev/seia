#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { execute } from '@oclif/core'

await execute({ development: true, dir: import.meta.url })
