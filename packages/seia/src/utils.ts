export const trimPrefix = (
	str: string,
	prefix: string,
): string =>
	str.startsWith(prefix) ? str.slice(prefix.length) : str

export const isObject = (
	value: unknown,
): value is Record<string, unknown> =>
	Object.prototype.toString.call(value) ===
	'[object Object]'

// valid JavaScript identifier
export type Anchor = string

// resolved id with anchor
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
				path: id.substring(0, i),
				anchor: id.substring(i + 1),
			}
}

export const mustParseAnchorId = (
	id: AnchorId,
): {
	path: string
	anchor: Anchor
} => {
	const res = parseAnchorId(id)
	if (res.anchor === null)
		throw new Error(
			`Can't extract anchor information from the given resolveId: ${id}`,
		)
	return res as { path: string; anchor: Anchor }
}
