// In your LoadingSpinner component file (likely in src/components/ui/LoadingSpinner.tsx)
interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Add this line if you want size prop
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${
      size ? sizeClasses[size] : 'h-4 w-4'
    } ${className || ''}`} />
  );
};