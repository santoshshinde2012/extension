import { SetStateAction, useState } from "react";


const SearchContainer = ({ onSearch }: { onSearch: Function }) => {
    const [input, setInput] = useState('');

    const onChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        const value = event.target.value ?? '';
        setInput(value);
        onSearch(value);
    }

    const handleSearch = () => {
        onSearch(input);
    };

    return (
        <div className="flex">
            <div className="relative w-full">
                <input type="search"
                    id="search-dropdown"
                    value={input}
                    onChange={onChange}
                    className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search Text" />
                <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSearch}>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </div>
        </div>
    );
};

SearchContainer.propTypes = {};

export default SearchContainer;