export interface BlueArchiveStudents {
	data: Array<BlueArchiveStudent>
}

export interface BlueArchiveStudent {
	_id: string
	name: string
	school: string
	birthday: string
	photoUrl: string
	imageSchool: string
	damageType: string
}
