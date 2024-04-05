# Getting Started with Chrome Extensions Using Vite, Typescript, React, Tailwindcss and IndexDB

### Introduction

As we all know, Chrome extensions are helping us increase our productivity as developers.  Every browser has bookmark functionality where we can bookmark the link for future references, and I had so many bookmarks, but I was not able to find out the date when I marked any URL as a bookmark. The browser is collecting that information but not displaying it in the side panel or in Chrome://bookmarks/. So I have decided to create a Chrome extension for my purpose to collect and display bookmark data as per my need, or how we can extend this functionality to get more results out of it.

### Step 1: Setup Your Project

#### Create a new React project with Vite
```
➜  workspace npm create vite@latest
✔ Project name: … extension
✔ Select a framework: › React
✔ Select a variant: › TypeScript

Scaffolding project in /Users/santosh/Documents/workspace/extension...

Done. Now run:

  cd extension
  npm install
  npm run dev

```

#### Install Tailwind CSS & Create a Tailwind CSS configuration file

For styling, we are going to use tailwindcss so let's install this: `npm install -save-dev tailwindcss postcss autoprefixer`. Generate a Tailwind configuration file using the command: ` npx tailwindcss init -p`.


```
➜  npm install -save-dev tailwindcss postcss autoprefixer

added 77 packages, and audited 296 packages in 4s

65 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  npx tailwindcss init -p

Created Tailwind CSS config file: tailwind.config.js
Created PostCSS config file: postcss.config.js
➜   
```

####  Configure Tailwindcss 

We need to specify the path to our React template files by doing a configuration setting.

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

#### Import Tailwind CSS in your styles

Create a CSS or SCSS file (e.g., `src/index.css`) where you can import Tailwind CSS. 

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Please find below the initial level folder structure for your current project.

````
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
````

### Step 2: Develop Your Chrome Extension

To develop a Chrome extension, we must first understand the Chrome Extension Architecture. Please find below the high-level visualization of the Chrome Extension.

#### Chrome Extension Architecture:

- Manifest File (manifest.json): Defines extension metadata, including permissions and components.
- Background Script: Persists to manage extension functionality and handle events.
- Content Scripts: Injected into web pages to interact with and modify DOM.
- Popup Page: Provides a compact UI when the extension icon is clicked.
- Options Page: Allows users to customize extension settings.
- Browser Action / Page Action: UI elements enabling user interaction with the extension.

#### Create Chrome Extension Files:

- manifest.json [`public/manifest.json`]: Configuration file that defines the metadata and settings for a Chrome extension.
- background script [`src/background/index.ts`]: JavaScript file that runs in the background of the browser, allowing the extension to listen for events and perform tasks.
- content scripts [`/Users/santosh/Documents/workspace/boilerplates/extension/src/content/index.ts`]: JavaScript files that run within the context of web pages, enabling the extension to interact with and modify the content of web pages.
- pop-up HTML [`index.html`]:  HTML file that represents the user interface of a pop-up window displayed when the extension's icon is clicked, typically used for user interaction and settings.

In our case, we are going to use react and typescript code, so we are going to create all source files in the src folder, but we have to make sure that at the time of bundling, we need to create separate background js, content scripts, and other react components code in another file.

For this, we need to update the vite config(`vite.config.ts`) with rollup options. Refer to the below config for it.

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        index: './index.html',
        background: './src/background/index.ts',
        content: './src/content/index.ts',
      },
      output: {
        entryFileNames: `[name].js`
      }
    }
  },

})

```

#### Permissions

Understand how permissions work in Chrome extensions. Depending on the functionality of your extension, you may need to request various permissions in the `manifest.json` file.

In our case, we are going to use the below permissions:
 
- tabs
- bookmarks
- history
- storage

#### Event-driven Programming

Chrome extensions are event-driven. You should be familiar with event-driven programming concepts to handle events like user clicks, page loads, etc., effectively.


### Step 3: Create a real-time use case to use the Chrome API.

We are going to consider one simple use case where we can access the list of bookmarks from the Chrome browser, format them, collect the meta information, and store it in IndexDB.

To put this into action, we must first determine our implementation strategy and technology stack. We must construct popup components, which will contain a variety of different components depending on the use case.

In our scenario, we need a bookmark list and an item to display the list of bookmarks, as well as a search component.

We also need to sync the bookmarks, store them in IndexedDB, and export the IndexedDB data as JSON. To accomplish this, we will utilize the React custom hook to connect to IndexedDB, export IndexedDB records in JSON format, and search for entries in IndexedDB.

Why have we decided to use IndexDB?

Web developers frequently use IndexedDB for client-side storage because of the following benefits it provides over other storage options:

- Asynchronous API: IndexedDB offers asynchronous operations for non-blocking storage tasks.
- Rich Querying Capabilities: Supports complex queries for efficient data retrieval.
- Large Storage Capacity: Provides ample space suitable for storing extensive datasets.
- Structured Storage: Stores data in a structured format, facilitating organization and retrieval.
- Transaction Support: Operates within transactions, ensuring data integrity during operations.
- Cross-browser Support: Supported by major modern web browsers for broad compatibility.

Once this is complete, the structure of our folders might look like this:

````
├── public
│   ├── background.js
│   ├── icons
│   │   ├── icon128.png
│   │   ├── icon16.png
│   │   ├── icon19.png
│   │   ├── icon32.png
│   │   ├── icon38.png
│   │   └── icon48.png
│   ├── manifest.json
│   └── vite.svg
├── src
│   ├── Popup.tsx
│   ├── components
│   │   ├── BookmarksList.tsx
│   │   ├── BookmarksListItem.tsx
│   │   ├── Footer.tsx
│   │   ├── ImportData.tsx
│   │   └── SearchContainer.tsx
│   ├── constants.ts
│   ├── hooks
│   │   ├── useIndexedDB.tsx
│   │   ├── useIndexedDBCount.tsx
│   │   ├── useIndexedDBExport.tsx
│   │   └── useIndexedDBSearch.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── social.json
│   ├── types.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
````
