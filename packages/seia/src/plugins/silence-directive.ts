import { Plugin } from 'vite'
import { P, match } from 'ts-pattern'

export const silenceDirective = (): Plugin => {
	return {
		name: 'seia:silence-directive',
		onLog(level, log) {
			return match([level, log])
				.with(
					[
						'warn',
						P.union(
							{
								code: 'MODULE_LEVEL_DIRECTIVE',
								message: P.when(msg =>
									msg.includes('use client'),
								),
							},
							{
								code: 'SOURCEMAP_ERROR',
								message: P.when(msg =>
									msg.includes(
										`Error when using sourcemap for reporting an error: Can't resolve original location of error.`,
									),
								),
							},
						),
					],
					() => false,
				)
				.otherwise(() => null)
		},
	}
}
