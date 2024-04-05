import { useEffect, useState } from "react";

const Footer = ({ onSnyk, handleExportClick, count = 0 }: { onSnyk: Function, handleExportClick: Function, count: number | null }) => {

    const [syncStatus, setSyncStatus] = useState(false);

    useEffect(() => {
        if (chrome?.runtime) {
            chrome.runtime.onMessage.addListener(async function (message, _sender, _sendResponse) {
                const { action } = message;
                if (action == "DONE") {
                    setTimeout(() => {
                        setSyncStatus(false);
                    }, 1000);

                }
            });
        }
    }, [])

    const sync = () => {
        if (chrome?.runtime && !syncStatus) {
            setSyncStatus(true);
            onSnyk();
        }
    };

    const exportClick = () => {
        handleExportClick()
    }

    return (
        <ul className="flex px-3 py-3 items-center justify-between">
            <li>
                <a className="text-gray-700 hover:text-orange-600" aria-label="Twitter" href="https://twitter.com/shindesan2012" target="_blank">
                    <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                    </svg>
                </a>
            </li>
            <li>
                <a className="text-gray-700 hover:text-orange-600" aria-label="GitHub" href="https://github.com/santoshshinde2012" target="_blank">
                    <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.11.793-.26.793-.577 0-.284-.01-1.23-.015-2.233-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.088-.743.083-.727.083-.727 1.205.085 1.838 1.238 1.838 1.238 1.07 1.835 2.808 1.305 3.492.998.108-.776.42-1.305.764-1.604-2.665-.303-5.466-1.334-5.466-5.93 0-1.314.47-2.386 1.237-3.227-.124-.303-.536-1.526.117-3.177 0 0 1.007-.322 3.3 1.23a11.53 11.53 0 0 1 3-.404c1.016 0 2.037.136 3 .404 2.292-1.552 3.297-1.23 3.297-1.23.657 1.652.244 2.874.12 3.177.77.84 1.235 1.913 1.235 3.227 0 4.61-2.806 5.624-5.478 5.917.43.371.81 1.102.81 2.223 0 1.605-.015 2.896-.015 3.292 0 .314.19.688.798.572C20.566 21.795 24 17.296 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>

            </li>
            <li>
                <a className="text-gray-700 hover:text-orange-600" aria-label=" LinkedIn" href="https://www.linkedin.com/in/santosh-shinde-54454635/" target="_blank"><svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-8">
                    <path fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                    </path>
                </svg>
                </a>
            </li>
            <li className="text-gray-700 hover:text-orange-600">
                <button className="h-8" onClick={exportClick} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-8">
                        <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" fill="currentColor" />
                        <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" fill="currentColor" />
                    </svg>
                </button>
            </li>

            <li className="text-gray-700 hover:text-orange-600">
                <button className="h-8" onClick={sync} >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 ${syncStatus ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                    </svg>
                    <div className="text-sm text-gray-500 text-center">{count}</div>
                </button>
            </li>
        </ul >
    );
};

export default Footer