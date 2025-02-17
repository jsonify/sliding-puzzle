interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Oops! Something went wrong
        </h2>
        
        <div className="bg-slate-900/50 p-4 rounded-md mb-6 text-left overflow-auto">
          <p className="text-sm font-mono text-slate-300 break-all">
            {error.message}
          </p>
        </div>
        
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          type="button"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}