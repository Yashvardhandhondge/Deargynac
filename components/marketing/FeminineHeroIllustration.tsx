'use client';

type FeminineHeroIllustrationProps = {
  height?: number;
};

export default function FeminineHeroIllustration({ height = 500 }: FeminineHeroIllustrationProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatUpDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes wave-hand {
          0%, 100% { transform: rotate(0deg); transform-origin: bottom center; }
          25% { transform: rotate(20deg); transform-origin: bottom center; }
          75% { transform: rotate(-10deg); transform-origin: bottom center; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        .float-1 { animation: floatUp 4s ease-in-out infinite; }
        .float-2 { animation: floatUp 3.5s ease-in-out infinite 0.5s; }
        .float-3 { animation: floatUp 5s ease-in-out infinite 1s; }
        .float-4 { animation: floatUpDelay 4s ease-in-out infinite 1.5s; }
        .pulse-icon { animation: pulse-soft 2s ease-in-out infinite; }
        .sparkle-1 { animation: sparkle 2s ease-in-out infinite; }
        .sparkle-2 { animation: sparkle 2s ease-in-out infinite 0.7s; }
        .sparkle-3 { animation: sparkle 2s ease-in-out infinite 1.4s; }
        .heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .slide-in { animation: slideInLeft 0.8s ease-out forwards; }
        .bounce-in { animation: bounceIn 0.6s ease-out forwards; }
      `}</style>

      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        aria-hidden
      >
        {/* Background circle - soft rose */}
        <circle cx="250" cy="260" r="200" fill="rgba(194,24,91,0.04)" />
        <circle cx="250" cy="260" r="160" fill="rgba(194,24,91,0.03)" />

        {/* ===== MAIN GIRL CHARACTER ===== */}
        {/* Body/Dress - rose colored cute dress */}
        <ellipse cx="250" cy="360" rx="55" ry="65" fill="#F4A7C3" />
        <ellipse cx="250" cy="390" rx="65" ry="45" fill="#C2185B" />

        {/* Dress details - white collar */}
        <ellipse cx="250" cy="310" rx="25" ry="12" fill="white" opacity="0.8" />

        {/* Dress pattern - small dots */}
        <circle cx="235" cy="340" r="2.5" fill="white" opacity="0.6" />
        <circle cx="250" cy="335" r="2.5" fill="white" opacity="0.6" />
        <circle cx="265" cy="340" r="2.5" fill="white" opacity="0.6" />
        <circle cx="242" cy="355" r="2.5" fill="white" opacity="0.6" />
        <circle cx="258" cy="355" r="2.5" fill="white" opacity="0.6" />

        {/* Neck */}
        <rect x="243" y="285" width="14" height="20" rx="7" fill="#FDBCB4" />

        {/* Head */}
        <ellipse cx="250" cy="265" rx="40" ry="42" fill="#FDBCB4" />

        {/* Hair - long flowing dark hair */}
        <ellipse cx="250" cy="248" rx="42" ry="25" fill="#2D1B1B" />
        {/* Hair sides */}
        <ellipse cx="215" cy="270" rx="15" ry="35" fill="#2D1B1B" />
        <ellipse cx="285" cy="270" rx="15" ry="35" fill="#2D1B1B" />
        {/* Hair top volume */}
        <ellipse cx="250" cy="235" rx="38" ry="20" fill="#3D2424" />
        {/* Hair highlight */}
        <ellipse cx="235" cy="238" rx="8" ry="5" fill="#5D3A3A" opacity="0.5" />

        {/* Hair accessory - cute flower clip */}
        <circle cx="285" cy="248" r="8" fill="#D4A017" />
        <circle cx="285" cy="248" r="4" fill="#F59E0B" />
        <circle cx="285" cy="240" r="4" fill="#FDE68A" />
        <circle cx="293" cy="248" r="4" fill="#FDE68A" />
        <circle cx="285" cy="256" r="4" fill="#FDE68A" />
        <circle cx="277" cy="248" r="4" fill="#FDE68A" />

        {/* Face - Eyes */}
        <ellipse cx="237" cy="268" rx="6" ry="7" fill="#1A0A12" />
        <ellipse cx="263" cy="268" rx="6" ry="7" fill="#1A0A12" />
        {/* Eye shine */}
        <circle cx="239" cy="265" r="2" fill="white" />
        <circle cx="265" cy="265" r="2" fill="white" />
        {/* Eyelashes */}
        <line x1="231" y1="262" x2="228" y2="258" stroke="#1A0A12" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="234" y1="261" x2="232" y2="257" stroke="#1A0A12" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="257" y1="261" x2="255" y2="257" stroke="#1A0A12" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="260" y1="261" x2="260" y2="257" stroke="#1A0A12" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="268" y1="262" x2="270" y2="258" stroke="#1A0A12" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyebrows */}
        <path d="M230 260 Q237 256 244 260" stroke="#3D2424" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M256 260 Q263 256 270 260" stroke="#3D2424" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Cute smile */}
        <path d="M240 280 Q250 290 260 280" stroke="#C2185B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <ellipse cx="228" cy="278" rx="9" ry="6" fill="#F9A8D4" opacity="0.6" />
        <ellipse cx="272" cy="278" rx="9" ry="6" fill="#F9A8D4" opacity="0.6" />

        {/* Small nose */}
        <circle cx="250" cy="275" r="2" fill="#F9A8D4" opacity="0.7" />

        {/* Arms */}
        {/* Left arm holding phone */}
        <path d="M210 320 Q190 330 185 350" stroke="#FDBCB4" strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M290 320 Q310 330 315 310" stroke="#FDBCB4" strokeWidth="14" fill="none" strokeLinecap="round" />

        {/* Phone in left hand */}
        <rect x="160" y="345" width="40" height="65" rx="6" fill="#1A0A12" />
        <rect x="163" y="350" width="34" height="52" rx="3" fill="#C2185B" />
        {/* Phone screen - DearGynac app */}
        <rect x="165" y="355" width="30" height="40" rx="2" fill="#FDF8F5" />
        <rect x="168" y="358" width="24" height="4" rx="2" fill="#C2185B" />
        <rect x="168" y="365" width="18" height="2" rx="1" fill="#9CA3AF" />
        <rect x="168" y="370" width="20" height="2" rx="1" fill="#9CA3AF" />
        <rect x="168" y="375" width="15" height="2" rx="1" fill="#9CA3AF" />
        {/* Heart on phone */}
        <text x="168" y="390" fontSize="8" fill="#C2185B">
          ♥️ DearGynac
        </text>

        {/* Phone home button */}
        <circle cx="180" cy="406" r="4" fill="#374151" />

        {/* Legs/sitting position */}
        <ellipse cx="225" cy="430" rx="20" ry="12" fill="#C2185B" />
        <ellipse cx="275" cy="430" rx="20" ry="12" fill="#C2185B" />
        {/* Feet */}
        <ellipse cx="215" cy="445" rx="15" ry="8" fill="#FDBCB4" />
        <ellipse cx="285" cy="445" rx="15" ry="8" fill="#FDBCB4" />
        {/* Shoes */}
        <ellipse cx="215" cy="450" rx="16" ry="7" fill="#880E4F" />
        <ellipse cx="285" cy="450" rx="16" ry="7" fill="#880E4F" />

        {/* ===== FLOATING HEALTH ICONS ===== */}

        {/* Floating heart - top left */}
        <g className="float-1" style={{ animationDuration: '3s' }}>
          <circle cx="100" cy="160" r="28" fill="#FDE8F0" />
          <circle cx="100" cy="160" r="22" fill="white" />
          <text x="88" y="167" fontSize="20" className="heartbeat">
            ❤️
          </text>
        </g>

        {/* Floating flower - top right */}
        <g className="float-2">
          <circle cx="400" cy="140" r="28" fill="#FBF3DC" />
          <circle cx="400" cy="140" r="22" fill="white" />
          <text x="388" y="147" fontSize="20">
            🌸
          </text>
        </g>

        {/* Floating calendar - left */}
        <g className="float-3">
          <circle cx="80" cy="300" r="28" fill="#EDE9FE" />
          <circle cx="80" cy="300" r="22" fill="white" />
          <text x="68" y="307" fontSize="20">
            📅
          </text>
        </g>

        {/* Floating stethoscope - right */}
        <g className="float-4">
          <circle cx="420" cy="280" r="28" fill="#DCFCE7" />
          <circle cx="420" cy="280" r="22" fill="white" />
          <text x="408" y="287" fontSize="20">
            🩺
          </text>
        </g>

        {/* Floating star - top center */}
        <g className="float-2" style={{ animationDuration: '4s' }}>
          <circle cx="350" cy="180" r="22" fill="#FEF3C7" />
          <circle cx="350" cy="180" r="16" fill="white" />
          <text x="342" y="186" fontSize="14">
            ⭐
          </text>
        </g>

        {/* Small floating pill */}
        <g className="float-1" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          <circle cx="150" cy="180" r="18" fill="#FDE8F0" />
          <text x="142" y="186" fontSize="14">
            💊
          </text>
        </g>

        {/* ===== SPARKLES ===== */}
        {/* Sparkle 1 */}
        <g className="sparkle-1">
          <path d="M340 230 L342 226 L344 230 L348 232 L344 234 L342 238 L340 234 L336 232 Z" fill="#D4A017" />
        </g>
        {/* Sparkle 2 */}
        <g className="sparkle-2">
          <path d="M130 220 L132 216 L134 220 L138 222 L134 224 L132 228 L130 224 L126 222 Z" fill="#C2185B" />
        </g>
        {/* Sparkle 3 */}
        <g className="sparkle-3">
          <path d="M380 320 L382 316 L384 320 L388 322 L384 324 L382 328 L380 324 L376 322 Z" fill="#D4A017" />
        </g>
        {/* Sparkle 4 */}
        <g className="sparkle-1" style={{ animationDelay: '1s' }}>
          <path d="M160 380 L162 376 L164 380 L168 382 L164 384 L162 388 L160 384 L156 382 Z" fill="#C2185B" opacity="0.7" />
        </g>

        {/* ===== FLOATING CHAT BUBBLE ===== */}
        <g className="float-2" style={{ animationDelay: '1s' }}>
          {/* Chat bubble */}
          <rect
            x="300"
            y="320"
            width="130"
            height="50"
            rx="12"
            fill="white"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(194,24,91,0.15))' }}
          />
          <polygon points="310,370 320,380 330,370" fill="white" />
          {/* Chat content */}
          <circle cx="318" cy="338" r="7" fill="#C2185B" />
          <text x="315" y="342" fontSize="8" fill="white" fontWeight="bold">
            ✓
          </text>
          <rect x="330" y="332" width="85" height="5" rx="2.5" fill="#E5E7EB" />
          <rect x="330" y="342" width="65" height="5" rx="2.5" fill="#E5E7EB" />
          <rect x="330" y="352" width="75" height="5" rx="2.5" fill="#FDE8F0" />
        </g>

        {/* ===== DECORATIVE DOTS ===== */}
        <circle cx="60" cy="200" r="5" fill="#FDE8F0" className="pulse-icon" />
        <circle
          cx="70"
          cy="230"
          r="3"
          fill="#C2185B"
          opacity="0.3"
          className="pulse-icon"
          style={{ animationDelay: '0.5s' }}
        />
        <circle cx="440" cy="200" r="5" fill="#FBF3DC" className="pulse-icon" style={{ animationDelay: '1s' }} />
        <circle
          cx="430"
          cy="350"
          r="4"
          fill="#C2185B"
          opacity="0.2"
          className="pulse-icon"
          style={{ animationDelay: '1.5s' }}
        />

        {/* ===== GROUND SHADOW ===== */}
        <ellipse cx="250" cy="465" rx="90" ry="12" fill="rgba(194,24,91,0.08)" />
      </svg>
    </div>
  );
}
