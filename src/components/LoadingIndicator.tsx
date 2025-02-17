interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({ message = 'Loading...' }: LoadingIndicatorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
        
        {/* Backdrop blur and gradient */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-slate-900/50 to-transparent -z-10" />
      </div>
      
      {/* Loading message */}
      <p className="mt-4 text-slate-300 text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
}