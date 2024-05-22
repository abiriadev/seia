;(globalThis as any).__webpack_module_loading__ ||=
	new Map()
;(globalThis as any).__webpack_module_cache__ ||= new Map()
;(globalThis as any).__webpack_chunk_load__ ||= async (
	id: string,
) => (globalThis as any).__webpack_module_loading__.get(id)
;(globalThis as any).__webpack_require__ ||= (id: string) =>
	(globalThis as any).__webpack_module_cache__.get(id)
