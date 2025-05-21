import React from 'react';

function Loading({ text = 'Loading...', size = 'md' }) {
  // Size variations
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const spinnerSize = spinnerSizes[size] || spinnerSizes.md;
  const textSize = textSizes[size] || textSizes.md;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500 my-2">
        <div className={`${spinnerSize}`}></div>
      </div>
      {text && <p className={`${textSize} text-gray-600 mt-2`}>{text}</p>}
    </div>
  );
}

export default Loading;