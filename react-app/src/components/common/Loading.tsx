import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="loader"></div>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading...</p>
    </div>
  );
};

export default Loading;