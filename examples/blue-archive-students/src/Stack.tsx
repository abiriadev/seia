// This is shared component, since it's used in both server and client components.
// Thus, the code for `Stack` would be duplicated in both server and client bundle.
import { Children, ElementType, PropsWithChildren, ReactNode } from 'react'

export interface StackProps extends PropsWithChildren {
	component?: ElementType
	divider?: ReactNode
	className?: string
}

export const Stack = ({
	component = 'div',
	divider,
	className,
	children,
}: StackProps) => {
	const childrenArr = Children.toArray(children)

	const Component = component

	return (
		<Component className={className}>
			{([] as ReactNode[])
				.concat(...childrenArr.map(n => [n, divider]))
				.slice(0, -1)}
		</Component>
	)
}
