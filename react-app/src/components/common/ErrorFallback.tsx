import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-50 dark:bg-neutral-900 text-center">
      <div className="w-20 h-20 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-error-500" />
      </div>
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Something went wrong</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-lg">
        We encountered an error while processing your request. Please try again or contact support if the problem persists.
      </p>
      <pre className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-md text-left overflow-auto max-w-full w-full md:w-3/4 lg:w-1/2 mb-6 text-sm">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="btn-primary"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;