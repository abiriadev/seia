// Manual code splitting because of rollup's limitations
import { basename, dirname, extname, join } from 'node:path'

export const changeExtension = (path: string, ext: string): string =>
	join(dirname(path), basename(path, extname(path)) + ext)
