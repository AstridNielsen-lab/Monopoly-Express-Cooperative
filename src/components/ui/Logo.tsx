import React from 'react';
import { Truck } from 'lucide-react';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'white';
};

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'default' }) => {
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-5xl',
  };

  const colorClasses = variant === 'white' ? 'text-white' : 'text-accent';

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <Truck className={`mr-2 ${colorClasses}`} size={size === 'large' ? 36 : size === 'medium' ? 28 : 24} />
      <span className={`font-heading font-bold ${colorClasses}`}>
        Monopoly<span className="text-primary">Express</span>
      </span>
    </div>
  );
};

export default Logo;
export { Logo };
