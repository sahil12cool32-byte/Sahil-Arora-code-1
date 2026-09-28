/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

// G20 India Logo
export const G20Logo: React.FC<{ className?: string }> = ({ className = 'h-16' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 160 95" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Letter G */}
        <path
          d="M32 18 C16 18, 6 28, 6 45 C6 62, 17 72, 33 72 C46 72, 54 64, 56 52 L34 52 L34 41 L67 41 C67 68, 52 82, 33 82 C11 82, -4 67, -4 45 C-4 22, 12 8, 33 8 C44 8, 54 12, 61 20 L53 28 C47 22, 41 18, 32 18 Z"
          fill="#E77817"
          transform="translate(14, -2) scale(0.7)"
        />
        {/* Number 2 */}
        <path
          d="M60 16 C60 8, 68 3, 79 3 C90 3, 98 8, 98 18 C98 27, 91 33, 80 43 L63 59 L99 59 L99 69 L53 69 L53 60 L75 38 C84 29, 87 24, 87 18 C87 12, 83 9, 78 9 C72 9, 68 12, 68 18 Z"
          fill="#138808"
          transform="translate(18, 5) scale(0.75)"
        />
        {/* Globe / Flower (The 0 of 20) */}
        <g transform="translate(108, 34) scale(0.65)">
          {/* Blue Globe circle */}
          <circle cx="20" cy="20" r="18" fill="#1C5BA6" />
          {/* Globe grid lines */}
          <ellipse cx="20" cy="20" rx="17" ry="8" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          <ellipse cx="20" cy="20" rx="8" ry="17" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          <line x1="3" y1="20" x2="37" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="20" y1="3" x2="20" y2="37" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Saffron & Green petals at base of 0 */}
          <path d="M4 32 C10 24, 20 28, 20 38 C14 36, 8 36, 4 32 Z" fill="#E77817" />
          <path d="M36 32 C30 24, 20 28, 20 38 C26 36, 32 36, 36 32 Z" fill="#138808" />
          <path d="M12 36 C16 30, 24 30, 28 36 C24 39, 16 39, 12 36 Z" fill="#064E3B" />
        </g>
        {/* Under text: भारत 2023 INDIA */}
        <text x="80" y="78" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1E293B" fontFamily="Noto Serif, serif">
          भारत <tspan fill="#E77817">2023</tspan> INDIA
        </text>
        {/* Motto: वसुधैव कुटुम्बकम् */}
        <text x="80" y="88" textAnchor="middle" fontSize="6" fontWeight="600" fill="#475569" fontFamily="serif">
          ONE EARTH · ONE FAMILY · ONE FUTURE
        </text>
      </svg>
    </div>
  );
};

// State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
export const AshokaEmblem: React.FC<{ className?: string }> = ({ className = 'h-20' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 130" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1E293B" strokeWidth="1.2" fill="#334155" strokeLinejoin="round" strokeLinecap="round">
          {/* Central Lion Head */}
          <path d="M42 16 C42 10, 46 6, 50 6 C54 6, 58 10, 58 16 C60 14, 63 17, 61 21 C64 24, 62 29, 58 31 C56 38, 54 44, 50 46 C46 44, 44 38, 42 31 C38 29, 36 24, 39 21 C37 17, 40 14, 42 16 Z" />
          {/* Eyes & Mane details for central lion */}
          <circle cx="47" cy="18" r="1.5" fill="#FFFFFF" stroke="none" />
          <circle cx="53" cy="18" r="1.5" fill="#FFFFFF" stroke="none" />
          <path d="M47 24 Q50 26 53 24" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M45 12 Q50 8 55 12" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
          <path d="M43 28 C45 35, 55 35, 57 28" fill="none" stroke="#FFFFFF" strokeWidth="1" />

          {/* Left Lion Profile */}
          <path d="M38 18 C33 16, 26 20, 25 27 C24 33, 28 39, 34 43 C38 45, 41 43, 42 37 C42 32, 40 24, 38 18 Z" />
          <circle cx="29" cy="24" r="1.3" fill="#FFFFFF" stroke="none" />
          <path d="M26 31 Q30 33 34 30" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M24 23 C22 25, 23 29, 27 32" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Right Lion Profile */}
          <path d="M62 18 C67 16, 74 20, 75 27 C76 33, 72 39, 66 43 C62 45, 59 43, 58 37 C58 32, 60 24, 62 18 Z" />
          <circle cx="71" cy="24" r="1.3" fill="#FFFFFF" stroke="none" />
          <path d="M74 31 Q70 33 66 30" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M76 23 C78 25, 77 29, 73 32" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Chest & Legs supporting */}
          <path d="M33 43 C33 55, 38 64, 40 68 L60 68 C62 64, 67 55, 67 43 C60 48, 40 48, 33 43 Z" />
          <path d="M42 48 L42 66" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M50 47 L50 67" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M58 48 L58 66" stroke="#FFFFFF" strokeWidth="1" />

          {/* Abacus / Base Platform */}
          <path d="M18 69 L82 69 L84 83 L16 83 Z" fill="#475569" />
          {/* Ashoka Chakra in Center of Abacus */}
          <circle cx="50" cy="76" r="5.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <circle cx="50" cy="76" r="1.2" fill="#1E293B" stroke="none" />
          <line x1="50" y1="71" x2="50" y2="81" stroke="#1E293B" strokeWidth="0.6" />
          <line x1="45" y1="76" x2="55" y2="76" stroke="#1E293B" strokeWidth="0.6" />
          <line x1="46.5" y1="72.5" x2="53.5" y2="79.5" stroke="#1E293B" strokeWidth="0.6" />
          <line x1="46.5" y1="79.5" x2="53.5" y2="72.5" stroke="#1E293B" strokeWidth="0.6" />

          {/* Bull on Left */}
          <path d="M26 73 C29 73, 31 75, 30 78 C28 80, 24 80, 24 77 C24 74, 25 73, 26 73 Z" fill="#CBD5E1" stroke="none" />
          {/* Galloping Horse on Right */}
          <path d="M72 73 C75 73, 76 76, 74 79 C71 80, 69 77, 70 75 C71 73, 71 73, 72 73 Z" fill="#CBD5E1" stroke="none" />

          {/* Bell-shaped Lotus Foundation */}
          <path d="M22 84 C28 84, 30 95, 34 98 L66 98 C70 95, 72 84, 78 84 Z" fill="#334155" />
          <path d="M36 86 C38 92, 42 96, 44 97" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />
          <path d="M50 85 L50 97" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />
          <path d="M64 86 C62 92, 58 96, 56 97" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />

          {/* Bottom Plinth */}
          <rect x="25" y="99" width="50" height="3" fill="#1E293B" stroke="none" />
        </g>

        {/* Text: सत्यमेव जयते */}
        <text
          x="50"
          y="114"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#0F172A"
          fontFamily="serif"
          letterSpacing="0.5"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
};

// National Career Service (NCS) Logo
export const NCSLogo: React.FC<{ className?: string }> = ({ className = 'h-16' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 170 85" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic Tri-Color Swirl / Waves */}
        <g transform="translate(15, -4)">
          {/* Saffron Ribbon */}
          <path
            d="M20 22 C35 8, 65 14, 85 24 C70 21, 45 20, 25 32 Z"
            fill="#E77817"
          />
          {/* Green Ribbon */}
          <path
            d="M30 36 C50 26, 75 28, 95 38 C75 36, 55 37, 35 48 Z"
            fill="#138808"
          />
          {/* Golden Yellow Ribbon & Center */}
          <path
            d="M25 28 C45 16, 70 20, 90 30 C72 29, 50 30, 32 40 Z"
            fill="#F59E0B"
          />
          {/* Person Head / Sun dot */}
          <circle cx="48" cy="12" r="4.5" fill="#1E40AF" />
          <circle cx="48" cy="12" r="2" fill="#FFFFFF" />
        </g>

        {/* Text: National Career Service */}
        <text
          x="85"
          y="56"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#1E293B"
          fontFamily="sans-serif"
          letterSpacing="0.2"
        >
          National Career Service
        </text>

        {/* Slogan Hindi: सही अवसर, सही समय */}
        <text
          x="85"
          y="67"
          textAnchor="middle"
          fontSize="7"
          fontWeight="600"
          fill="#475569"
          fontFamily="sans-serif"
        >
          सही अवसर, सही समय
        </text>

        {/* Slogan English: Right Opportunities, Right Time */}
        <text
          x="85"
          y="76"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="500"
          fill="#64748B"
          fontFamily="sans-serif"
        >
          Right Opportunities, Right Time
        </text>
      </svg>
    </div>
  );
};
