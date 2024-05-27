import { Plugin } from 'vite'

export const detectBoundaries = (): Plugin => {
	return {
		name: 'seia:detect-boundaries',
		moduleParsed(info) {
			console.log(info.id)
		},
		onLog(level, log) {
			if (
				level === 'warn' &&
				log.code === 'MODULE_LEVEL_DIRECTIVE' &&
				log.message.includes('use client')
			)
				return false
		},
	}
}
