import { join, dirname, basename, extname } from 'node:path'

export const trimPrefix = (
	str: string,
	prefix: string,
): string =>
	str.startsWith(prefix) ? str.slice(prefix.length) : str

export const changeExtension = (
	path: string,
	ext: string,
): string =>
	join(dirname(path), basename(path, extname(path)) + ext)

export const isObject = (
	value: unknown,
): value is Record<string, unknown> =>
	Object.prototype.toString.call(value) ===
	'[object Object]'
