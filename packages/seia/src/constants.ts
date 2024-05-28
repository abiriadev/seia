import chalk from 'chalk'
import { createRequire } from 'node:module'

export const seiaBanner = `  "m             #  m    mmmmm
m  #mmm""#     m"    """"m  m"
 ""#   m"  mm""m         #""  
   #  "        #        m"    
   "mmmmm      #       m"     `

export const seiaColor = '#fab359'

export const seiaChalk = chalk.hex(seiaColor)
export const seiaBgChalk = chalk.bgHex(seiaColor)

const require = createRequire(import.meta.url)

export const version = require('../package.json').version
