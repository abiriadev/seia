import { type Plugin } from 'vite'

export const filterCss = (): Plugin => {
	return {
		name: 'seia:filter-css',
		enforce: 'pre',
		resolveId(source, importer, options) {
			if (source.endsWith('.css'))
				return {
					id: source,
					external: true,
					moduleSideEffects: false,
				}
		},
	}
}
