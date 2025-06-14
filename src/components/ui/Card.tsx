import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
};

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false 
}) => {
  return (
    <div 
      className={`
        bg-secondary-light rounded-xl p-6 shadow-card
        ${hoverEffect ? 'hover:shadow-card-hover transition-shadow duration-300 transform hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
export { Card };
