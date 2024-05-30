// This is server component, producing static footer markup.
import { Stack } from './Stack'

const linkMap = {
	'See source':
		'https://github.com/abiriadev/seia/blob/main/example/blue-archive-students',
	Documentation: 'https://seia.dev',
	'Join community': 'https://github.com/abiriadev/seia/discussions',
}

export const Footer = () => (
	<footer className="flex flex-col justify-center items-center pt-20 pb-24">
		<p className="text-center text-lg font-light mb-3">
			Powered by{' '}
			<a
				href="https://github.com/abiriadev/seia"
				className="underline text-primary"
			>
				Seia.js
			</a>
		</p>
		<nav>
			<Stack component={'ul'} className="flex gap-3" divider="·">
				{Object.entries(linkMap).map(([text, href], i) => (
					<li key={i}>
						<a href={href} className="underline">
							{text}
						</a>
					</li>
				))}
			</Stack>
		</nav>
	</footer>
)
