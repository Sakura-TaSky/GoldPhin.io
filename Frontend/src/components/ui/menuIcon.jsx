import React from 'react';
import { Link } from 'react-router-dom';

const MenuIcon = ({
  link = '',
  name = '',
  icon,
  icon2,
  className = '',
  textClassName = '',
  onClick,
}) => {
  return (
    <Link
      onClick={onClick}
      to={link}
      className={`flex items-center justify-between gap-4 p-2 rounded smooth ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-sm ${textClassName}`}>{name}</span>
      </div>
      {icon2}
    </Link>
  );
};

export default MenuIcon;
