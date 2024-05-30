// This is indirect client component.
import { InputHTMLAttributes } from 'react'

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input
		className="w-full sm:w-1/2 lg:w-1/3 min-w-[220px] h-12 px-4 leading-loose text-base bg-white border border-primary/80 rounded-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
		{...props}
	/>
)
