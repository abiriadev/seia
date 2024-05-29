export const trimPrefix = (path: string, prefix: string): string =>
	path.startsWith(prefix) ? path.slice(prefix.length) : path

export const isObject = (value: unknown): value is Record<string, unknown> =>
	Object.prototype.toString.call(value) === '[object Object]'

// Valid JavaScript identifier
export type Anchor = string

// Resolved id with anchor
export type AnchorId = string

export const parseAnchorId = (
	id: AnchorId,
): {
	path: string
	anchor: Anchor | null
} => {
	const i = id.indexOf('#')
	return i === -1
		? { path: id, anchor: null }
		: {
				path: id.slice(0, Math.max(0, i)),
				anchor: id.slice(Math.max(0, i + 1)),
			}
}

export const mustParseAnchorId = (
	id: AnchorId,
): {
	path: string
	anchor: Anchor
} => {
	const parsed = parseAnchorId(id)
	if (parsed.anchor === null)
		throw new Error(
			`Can't extract anchor information from the given resolveId: ${id}`,
		)
	return parsed as { path: string; anchor: Anchor }
}
