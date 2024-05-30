import './App.css'
import { Footer } from './Footer'
import { Header } from './Header'
import { Students } from './Students'
import { BlueArchiveStudents } from './types'

const api = async () =>
	(
		(await (
			await fetch(
				'https://api-blue-archive.vercel.app/api/characters?perPage=200',
			)
		).json()) as BlueArchiveStudents
	).data.map(student => ({
		...student,
		name: student.name.replace(/ \([^)]*\)/, ''),
	}))

const res = await api()

export default () => {
	return (
		<div>
			<Header />
			<main className="px-10">
				<Students students={res} />
			</main>
			<Footer />
		</div>
	)
}
