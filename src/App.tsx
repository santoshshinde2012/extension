import SearchContainer from './components/SearchContainer';
import Footer from './components/Footer';
import { useIndexedDBCount } from './hooks/useIndexedDBCount';
import { useState } from 'react';
import BookmarksList from './components/BookmarksList';
import { useIndexedDBSearch } from './hooks/useIndexedDBSearch';
import { databaseName, objectStoreName } from './constants';
import useIndexedDBExport from './hooks/useIndexedDBExport';
import ImportData from './components/ImportData';

const App = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [totalCount] = useIndexedDBCount(databaseName, objectStoreName);
  const [foldersMap] = useIndexedDBSearch(searchTitle);
  const [_exportedData, handleExport] = useIndexedDBExport(databaseName, objectStoreName);

  const snyk = () => {
    chrome.runtime.sendMessage({ action: "SYNK" });
  }

  const handleExportClick = () => {
    handleExport();
  };

  const onSearch = async (input: string) => {
    setSearchTitle(input)
  }

  return (
    <div className="relative">
      <div className="sticky top-0 left-0 right-0 extension-width bg-gray-200 px-3 py-3 shadow-lg">
        <SearchContainer onSearch={onSearch} />
      </div>
      <div className="w-full">
        {
          !totalCount && (
            <ImportData />
          )
        }
        <BookmarksList foldersMap={foldersMap} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 extension-width bg-gray-200">
        <Footer onSnyk={snyk} count={totalCount} handleExportClick={handleExportClick} />
      </div>
    </div>
  );
};

export default App;