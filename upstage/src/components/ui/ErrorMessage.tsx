import React from 'react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-400">
    <p>Error: {error}</p>
  </div>
);