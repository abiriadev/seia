<div align="center">

<img src="https://static.wikia.nocookie.net/blue-archive/images/1/10/Seia_Icon.png" width="128" />

# Seia

![React](https://img.shields.io/badge/react%2019-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vite](https://img.shields.io/badge/swc-%23F8C557.svg?style=for-the-badge&logo=swc&logoColor=333333)
![Hono](https://img.shields.io/badge/hono-%23E36002.svg?style=for-the-badge&logo=hono&logoColor=white)

_Lightweight SSR framework for React Server Components_

[Getting started](#getting-started) •
[Try demo](./examples/blue-archive-students) •
[Documentation](https://seia.dev) •
[Community](https://github.com/abiriadev/seia/discussions)

</div>

## :sparkles: Key Features

-   **[React Server Components](https://react.dev/reference/rsc/server-components)** support: Renders ahead of time on the server and streams HTML to the client for improved performance.
-   Unlike [Next.js](https://nextjs.org) which works only with Webpack-compatible bundlers, Seia adopts **[Vite](https://vitejs.dev)** for faster development and better compatibility with a great ecosystem.
-   **Zero configuration and scaffolding**: No more `npx create-whatever-app`. Start a new project in seconds without any setup or scaffolding required.
-   **Minimal client bundle size**: Reduces the client bundle size to a minimum at build time, requiring only three files to hydrate on the client.
-   **Freedom to choose your tools**: Seia does not force you to use specific routing, data fetching, or state management solutions. Use your favorite tools.
-   **TypeScript support**: Comes with type-safe API and hooks out of the box, but allows you to use JavaScript if you prefer.
-   **Deploy anywhere**: Deploy your SSR server to Vercel, Netlify, Cloudflare Workers and anywhere [Hono](https://hono.dev) supports.

## :zap: Getting Started

Create a new empty React project or use your existing one. If you're unsure how to start, follow the [Vite's official template](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

Then, install Seia:

```sh
$ npm install seia.js
```

> [!TIP]
> You can use any package manager you prefer, such as `yarn` or `pnpm`.

> [!IMPORTANT]  
> Seia currently requires `react` and `react-dom` as peer dependencies with the exact version `19.0.0-beta-26f2496093-20240514`.  
> Once React 19 has a stable release, Seia will be updated to support the stable version.

After installation, build your project with the following command:

```sh
$ npx seia build
```

This will generate a `dist` folder containing the server and client bundles. To start the SSR server, use:

```sh
$ npx seia start
```

If there are no errors, you should see the server running at http://localhost:5314.

## :question: What is Server Components?

[React Server Components](https://react.dev/reference/rsc/server-components) is a new concept first introduced in React 18 that allows you to render components on the server, but not on the client. What does that mean?

In traditional SSR architectures, the server renders the components and sends the HTML to the client. The client then re-renders the components and hydrates the HTML to make it interactive. This means your components run on both the server and the client, allowing you to access only the intersection of Node.js (or other runtimes) and web browser APIs.

With server components, you don't have to worry about this limitation. You can specify which components should be rendered on the server and which should be rendered on the client. This allows you to access the full Node.js API on the server and the full web browser API on the client, giving you the best of both worlds.

Imagine a simple example like this:

```tsx
import { readFile } from 'node:fs/promises'

const FileContent = async ({ path }: { path: string }) => {
	const buffer = await readFile(path, 'utf-8')

	return <HtmlEscape>{buffer}</HtmlEscape>
}
```

We've created a basic file server with React!

The `FileContent` component reads a file from the file system on the server and returns its content as formatted HTML. We all know that reading server files from a browser is simply not possible! Therefore, the `FileContent` component should be a server component, ensuring that it will only render on the server.

Then, how do we specify that this component is a server component?

The answer is; we don't have to!

Every components are considered server components by default. If you want to specify that a component should be client component, you can simply write `"use client"` at the top of the file.

```tsx
'use client'

import { useState } from 'react'

const Counter = () => {
	const [count, setCount] = useState(0)

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<p>Count: {count}</p>
		</div>
	)
}
```

## :rocket: Try Demo

You can try a simple demo of Seia with the [Blue Archive Students](./examples/blue-archive-students) sample. This project is a simple SSR application that fetches and displays the list of students of the [Blue Archive](https://bluearchive.nexon.com/home).

:point_right: [Go to sample project README](./examples/blue-archive-students)

## :book: Documentation

For comprehensive details about the Seia API, configuration, and more, please visit the [API documentation](https://seia.dev).

## :heart: Support

Your support is invaluable for the ongoing maintenance and improvement of Seia. Here are some ways you can contribute:

-   **Spread the word.** Share Seia on social media, blogs, or other platforms to help more developers discover it.
-   **Give it a star.** If you like Seia, please give it a star on GitHub. This helps increase the project's visibility.
-   **Report bugs.** Seia is still in its early stages, and there may be a lot of bugs or issues that need to be fixed or at least documented. If you find any, please report them as an issue.
-   **Suggest improvements.** Seia's features are currently quite limited. If you have any ideas or know of similar frameworks with useful features, please share them. I am happy to consider new features.
-   **Build with Seia.** If you create something using Seia, please let me know. I would love to see your projects.
-   **Contribute to Seia.** I am glad that you are interested in contributing to Seia. Please see the below roadmap and opened issues to find out how you can help.

## :memo: Future Roadmap

-   [x] RSC & SSR code splitting.
-   [x] Minimize client bundle.
-   [ ] CommonJS modules.
-   [x] Provide configuration options and config file.
-   [ ] Vite HMR and fast refresh.
-   [ ] Stream RSC payload when navigating pages.
-   [ ] Support existing routing solutions, along with RSC.
-   [ ] Way to edit header or layout, for example like changing `<title>`.
-   [ ] Streaming and Suspense.
-   [x] Provide CLI.
-   [ ] Use user's Vite config and plugins.
-   [ ] Distribute Seia as a single Vite plugin, if possible.
-   [ ] Context API.
-   [ ] Allow importing external React libraries.
-   [ ] Server Action?
-   [ ] Reduce redundant Vite build call.
-   [ ] Rewrite `react-server-dom-webpack` dependency to pure Vite plugin.
-   [ ] Show build-time error when using client-side API without `"use client"`.
-   [ ] Add benchmarks.
-   [ ] Telemetry.
-   [ ] Remove hacks and webpack polyfills.
-   [ ] Allow user to use Seia as a hono middleware.

## :raising_hand: Where's the name from?

[Yurizono Seia(<ruby>百合<rt>ゆり</rt></ruby><ruby>園<rt>ぞの</rt></ruby>セイア)](https://bluearchive.fandom.com/wiki/Yurizono_Seia), member of the [Tea Party](https://bluearchive.fandom.com/wiki/Tea_Party) at [Trinity](https://bluearchive.fandom.com/wiki/Trinity_General_School) in the [Blue Archive](https://bluearchive.nexon.com/home).

## :grey_question: What does the default port number `5314` mean?

The port number `5314` is a [L33T](https://en.wikipedia.org/wiki/Leet) of "SEIA". This choice is inspired by [Vite using port 5173](https://github.com/vitejs/vite/pull/8148).

## :pray: Special Thanks

-   The [React](https://react.dev) team for RSC, and webpack version of its implementation.
-   [Rollup](https://rollupjs.org) by [Rich Harris](https://github.com/Rich-Harris) and [Vite](https://vitejs.dev) by [Evan You](https://evanyou.me) for best toolchain ever.
-   [SWC](https://swc.rs) by [kdy1](https://github.com/kdy1).
-   [Next.js](https://nextjs.org/) by [Vercel](https://vercel.com) for inspiration.
-   [vite-rsc](https://github.com/cyco130/vite-rsc) by [nksaraf](https://github.com/nksaraf) for inspiration.
-   [Waku](https://github.com/dai-shi/waku) by [Daishi Kato](https://github.com/dai-shi) for inspiration. A lot of part was inspired by Waku.
-   [Vike](https://vike.dev) by [brillout](https://github.com/brillout) for inspiration.
-   [Hono](https://hono.dev/) by [Yusuke Wada](https://yusu.ke)

## :scroll: License

[![MIT](https://img.shields.io/github/license/abiriadev/pia?color=fab359&style=for-the-badge)](./LICENSE)
