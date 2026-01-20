import React from 'react';

const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
            </defs>

            {/* Ultra-Minimalist Geometric B */}
            <rect x="15" y="15" width="16" height="70" rx="8" fill="url(#logo-gradient)" />
            <path
                d="M40 15H62C75.8071 15 87 26.1929 87 40C87 53.8071 75.8071 65 62 65H40V15Z"
                fill="url(#logo-gradient)"
                fillOpacity="0.7"
            />
            <path
                d="M40 50H68C80.1503 50 90 59.8497 90 72C90 84.1503 80.1503 94 68 94H40V50Z"
                fill="url(#logo-gradient)"
                fillOpacity="0.4"
            />
        </svg>
    );
};

export default Logo;
