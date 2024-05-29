// NOTE: typescript declare statement is global, so we should avoid redeclaring global `process` here, thus used `as any`
// it will now work well with `@types/node`, but of course this is hack. not a great idea.
;(globalThis as any).process = {
	env: {
		NODE_ENV: 'prodection',
	},
}
