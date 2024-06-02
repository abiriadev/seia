import { version } from 'node:os'

export const Footer = () => (
	<footer>
		<p>
			Powered by <a href="https://github.com/abiriadev/seia">Seia.js</a>
		</p>
		<p>OS: {version()}</p>
	</footer>
)
