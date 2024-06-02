import { useState } from 'react'

import { Counter } from './Counter'
import { Footer } from './Footer'

export default function App() {
	return (
		<main>
			<h1>Seia v0.1.2</h1>
			<Counter />
			<ul className="links">
				<li>
					<a
						className="link"
						href="https://github.com/abiriadev/seia#zap-getting-started"
					>
						Getting started
					</a>
				</li>
				<li>
					<a className="link" href="https://seia.dev">
						Documentation
					</a>
				</li>
				<li>
					<a
						className="link"
						href="https://github.com/abiriadev/seia/tree/main/examples/blue-archive-students"
					>
						Try demo
					</a>
				</li>
				<li>
					<a
						className="link"
						href="https://github.com/abiriadev/seia/discussions"
					>
						Community
					</a>
				</li>
			</ul>
			<Footer />
		</main>
	)
}
