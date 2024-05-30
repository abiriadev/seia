// The main entrypoint of the application
// It fetches data on the server and passes it to the client components to perform SSR
import { request } from 'undici'

import './App.css'
import { Footer } from './Footer'
import { Header } from './Header'
import { Students } from './Students'
import { BlueArchiveStudents } from './types'

export default async () => {
	// we use undici, which rely on native Node.js HTTP client
	// meaning that this code can't run in the browser.
	const students = (
		(await (
			await request(
				'https://api-blue-archive.vercel.app/api/characters?perPage=999',
			)
		).body.json()) as BlueArchiveStudents
	).data.map(student => ({
		...student,
		name: student.name.replace(/ \([^)]*\)/, ''),
	}))

	return (
		<div>
			<Header />
			<main className="px-10">
				<Students students={students} />
			</main>
			<Footer />
		</div>
	)
}
