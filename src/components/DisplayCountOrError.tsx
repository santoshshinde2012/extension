const DisplayCountOrError = ({ count, error }: { count: number | null; error: Error | null }) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-gray-100 p-4">
                {error ? (
                    <p className="text-red-500">{error.message}</p>
                ) : count === null ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <p className="text-green-500">Total count of records: {count}</p>
                )}
            </div>
        </div>
    );
};

export default DisplayCountOrError;