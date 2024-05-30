import { matchSorter } from 'match-sorter'
import { useState } from 'react'

import { Input } from './Input'
import { Stack } from './Stack'
import { Studnet } from './Student'
import { BlueArchiveStudent } from './types'

export interface StudentProps {
	students: Array<BlueArchiveStudent>
}

export const Students = ({ students }: StudentProps) => {
	const [studentsState, setStudentsState] =
		useState<Array<BlueArchiveStudent>>(students)
	const [search, setSearch] = useState<string | null>(null)

	const filteredStudents = search
		? matchSorter(studentsState, search, {
				keys: ['name'],
			})
		: studentsState

	return (
		<>
			<div className="flex justify-center mb-8">
				<Input
					value={search ?? ''}
					onChange={({ target: { value } }) =>
						setSearch(value === '' ? null : value)
					}
				/>
			</div>
			<Stack
				component={'ul'}
				className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-4"
			>
				{filteredStudents.map(student => (
					<li key={student._id}>
						<Studnet {...student} />
					</li>
				))}
			</Stack>
		</>
	)
}
