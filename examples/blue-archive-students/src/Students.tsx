'use client'

// This is explicit client component.
// It has local state, which is not possible in server components.
// It will be rendered on SSR server with the `students` data fetched by the server component,
// and then it will be hydrated on the client side, enabling interactive filter functionality.
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
	// we define state!
	const [search, setSearch] = useState<string | null>(null)

	const filteredStudents = search
		? matchSorter(students, search, {
				keys: ['name'],
			})
		: students

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
