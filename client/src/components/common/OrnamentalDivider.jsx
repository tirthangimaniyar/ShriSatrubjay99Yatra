import React from 'react';

export const OrnamentalDivider = ({ className = '', title }) => {
  return (
    <div className={`flex items-center justify-center my-6 py-2 ${className}`}>
      {/* Left Golden Line */}
      <div className="h-[1.5px] w-12 sm:w-24 md:w-36 bg-gradient-to-r from-transparent via-[#C59B27]/80 to-[#C59B27]"></div>
      
      {/* Central Sacred Motif */}
      <div className="mx-3 flex items-center space-x-2 text-[#C59B27]">
        <span className="text-xs">✦</span>
        {/* Sacred Jain Lotus / Temple Arch SVG */}
        <svg
          className="w-6 h-6 text-[#C59B27] drop-shadow-sm fill-current"
          viewBox="0 0 24 24"
        >
          {/* Temple Arch & Lotus Petal Shape */}
          <path d="M12 2L13.8 6.5C14.7 5.8 15.9 5.5 17 6C17.3 7.2 16.9 8.5 16 9.3C18 9.6 19.5 10.9 20 12.8C18.5 13.5 17 13.1 15.8 12.3C15.6 14.2 14.5 16.5 12 18C9.5 16.5 8.4 14.2 8.2 12.3C7 13.1 5.5 13.5 4 12.8C4.5 10.9 6 9.6 8 9.3C7.1 8.5 6.7 7.2 7 6C8.1 5.5 9.3 5.8 10.2 6.5L12 2Z" />
          <circle cx="12" cy="20.5" r="1.5" />
        </svg>
        {title && (
          <span className="font-gujaratiSerif font-bold text-xs uppercase tracking-wider text-yatra-maroon">
            {title}
          </span>
        )}
        <span className="text-xs">✦</span>
      </div>

      {/* Right Golden Line */}
      <div className="h-[1.5px] w-12 sm:w-24 md:w-36 bg-gradient-to-l from-transparent via-[#C59B27]/80 to-[#C59B27]"></div>
    </div>
  );
};
