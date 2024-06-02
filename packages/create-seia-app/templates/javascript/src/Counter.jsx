'use client'

import { useState } from 'react'

export const Counter = () => {
	const [count, setCount] = useState(0)

	return (
		<button onClick={() => setCount(count + 1)}>
			{count === 0 ? 'Click me!' : `Count: ${count}`}
		</button>
	)
}
