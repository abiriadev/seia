globalThis.__webpack_module_loading__ ||= new Map()
globalThis.__webpack_module_cache__ ||= new Map()
globalThis.__webpack_chunk_load__ ||= async (id: string) =>
	globalThis.__webpack_module_loading__.get(id)
globalThis.__webpack_require__ ||= (id: string) =>
	globalThis.__webpack_module_cache__.get(id)
