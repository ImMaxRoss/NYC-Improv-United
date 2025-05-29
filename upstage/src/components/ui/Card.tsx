import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className = '', children, hoverable = false, onClick }) => {
  const hoverClasses = hoverable ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : '';
  return (
    <div 
      className={`bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};