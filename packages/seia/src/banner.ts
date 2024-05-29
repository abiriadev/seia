import chalk from 'chalk'
import { version } from './package.js'
import { ResolvedSeiaConfig } from './config.js'
import { performance } from 'node:perf_hooks'

const seiaBanner = `  "m             #  m    mmmmm
m  #mmm""#     m"    """"m  m"
 ""#   m"  mm""m         #""  
   #  "        #        m"    
   "mmmmm      #       m"     `

const seiaColor = '#fab359'

const seiaChalk = chalk.hex(seiaColor)
const seiaBgChalk = chalk.bgHex(seiaColor)

const indent = '  '

export const makeBanner = ({ serve: { port } }: ResolvedSeiaConfig) => {
	return `\n${seiaChalk(
		seiaBanner
			.split('\n')
			.map(line => `${indent}${line}`)
			.join('\n'),
	)}\n\n${indent}${seiaBgChalk.black(
		' SEIA.js ',
	)} ${seiaChalk(`v${version}`)}  ${chalk.dim(
		`ready in ${chalk.bold(
			Math.ceil(performance.now() - globalThis.__SEIA_START_TIME),
		)} ms`,
	)}\n\n${indent}${chalk.green('➜')} ${chalk.bold(
		'Local',
	)} \t${chalk.blue(`http://localhost:${port}`)}`
}
