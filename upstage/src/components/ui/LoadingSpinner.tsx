import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
  </div>
);