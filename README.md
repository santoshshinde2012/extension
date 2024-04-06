# Chrome Extension - React + TypeScript + Vite

This repository contains the basic setup for the Chrome extension to read bookmarks, store them in the index database, and search for them by keyword.

## Technology Stack

- Vite
- Typescript
- React JS
- Chrome Extension Components
- Indexdb
- tailwind


### Start the application

- Clone the Application `git clone https://github.com/santoshshinde2012/extension.git`
- Install the dependencies `npm install`
- Test the application in the browser `npm run dev`, but you can't test the Chrome Runtime API.
- Build the extension `npm run build`

### Test the chrome extension

- Build:  Create a build by using the build command.
- Open Chrome Extensions Page: Type chrome://extensions/ in the address bar and hit Enter.
- Enable Developer Mode: Toggle Developer mode switch to on.
- Load the Extension: Click "Load unpacked" and select the extension directory.
- Confirm Loading: Extension appears in the Extensions page.
- Test: Verify the extension functions properly.

### Chrome Extension Components:

- HTML/CSS/JS Development: This is where you develop the actual content and functionality of the extension using HTML, CSS, and JavaScript.
- Manifest: The manifest file (manifest.json) describes the extension, its permissions, and other crucial details required by Chrome.
- Background Script: This script runs in the background and handles events and interactions.
- Popup Page: The UI that appears when the extension icon is clicked. It typically provides quick access to the extension's features.
- External APIs: Many extensions interact with external APIs for data retrieval, authentication, or other services.
- User Interaction/UI: This represents the user interface of the extension as displayed in the browser, including any interaction points or UI elements.

![Snapshot](wiki/assets/usecase.png)

<hr/>

### Connect with me on
<div id="badges">
  <a href="https://twitter.com/shindesan2012">
    <img src="https://img.shields.io/badge/shindesan2012-black?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter Badge"/>
  </a>
  <a href="https://www.linkedin.com/in/shindesantosh/">
    <img src="https://img.shields.io/badge/shindesantosh-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
   <a href="https://blog.santoshshinde.com/">
    <img src="https://img.shields.io/badge/Blog-black?style=for-the-badge&logo=medium&logoColor=white" alt="Medium Badge"/>
  </a>
  <a href="https://www.buymeacoffee.com/santoshshin" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" height="28" width="100">
    </a>
</div>