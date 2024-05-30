// This is indirect client component, since it's rendered by the `Students` client component.
import { BlueArchiveStudent } from './types'

// 코드 색상 = 폭발 #920008, 관통 #bc6f0e, 신비 #1F6095
const colorMap = {
	Explosive: '#920008',
	Penetration: '#bc6f0e',
	Mystic: '#1F6095',
}

export const Studnet = ({
	name,
	school,
	photoUrl,
	imageSchool,
	damageType,
}: BlueArchiveStudent) => {
	const color = colorMap[damageType as keyof typeof colorMap]

	return (
		<article
			className="flex flex-col pb-2 shadow-xl"
			style={{
				backgroundImage: `linear-gradient(-45deg, transparent 2%, ${color} 2%, ${color} 98%, transparent 95%)`,
			}}
		>
			<img src={photoUrl} alt={name} />
			<h2 className="text-xl font-blue font-bold text-white text-center text-ellipsis p-1">
				{name}
			</h2>
			<div className="grid grid-cols-[60px_1fr] justify-items-center items-center bg-white">
				<img
					src={
						imageSchool === 'https:undefined'
							? undefined
							: imageSchool
					}
					alt={school}
				/>
				<span className="font-semibold">{school}</span>
			</div>
		</article>
	)
}
