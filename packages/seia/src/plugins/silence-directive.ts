import { P, match } from 'ts-pattern'
import { type Plugin } from 'vite'

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
								message: P.when(message =>
									message.includes('use client'),
								),
							},
							{
								code: 'SOURCEMAP_ERROR',
								message: P.when(message =>
									message.includes(
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
