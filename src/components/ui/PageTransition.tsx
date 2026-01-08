'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [bikePosition, setBikePosition] = useState(-220)

  useEffect(() => {
    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 8, 100))
    }, 80)

    // Bike animation using JS for better control
    const startTime = Date.now()
    const duration = 1200
    const startPos = -220
    const endPos = window.innerWidth + 50

    const animateBike = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing function for smooth movement
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2
      
      const newPos = startPos + (endPos - startPos) * easeInOut
      setBikePosition(newPos)

      if (progress < 1) {
        requestAnimationFrame(animateBike)
      }
    }

    requestAnimationFrame(animateBike)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-stone-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Stars/particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animation: `pulse 2s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-stone-800">
        {/* Road surface texture */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-700 to-stone-800"></div>
        {/* Road center lines */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="flex gap-6 whitespace-nowrap"
            style={{
              animation: 'roadLines 0.4s linear infinite'
            }}
          >
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-10 h-1 bg-amber-500 flex-shrink-0"></div>
            ))}
          </div>
        </div>
        {/* Road edge line */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-amber-500/30"></div>
      </div>

      {/* Harley Davidson Animation Container */}
      <div className="absolute bottom-28 left-0 right-0 h-32">
        <div 
          className="absolute bottom-0"
          style={{ 
            left: `${bikePosition}px`,
            transform: `translateY(${Math.sin(Date.now() / 100) * 2}px)`
          }}
        >
          <HarleyBike />
          {/* Exhaust smoke */}
          <div className="absolute -left-6 bottom-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 bg-stone-500/50 rounded-full blur-sm"
                style={{ 
                  left: `${-i * 8}px`,
                  opacity: 0.6 - i * 0.2,
                  transform: `scale(${1 + i * 0.4})`,
                  animation: 'smokeFloat 0.5s ease-out infinite',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="text-center z-10 mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-wider drop-shadow-lg">
          VƯƠNG <span className="text-amber-500">CƯỜNG</span> 68
        </h1>
        <p className="text-stone-400 text-sm sm:text-lg uppercase tracking-[0.3em]">Xe Máy Cũ Uy Tín</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-stone-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="text-stone-500 text-sm mt-4 uppercase tracking-wider">Đang tải...</p>

      <style jsx global>{`
        @keyframes roadLines {
          0% { transform: translateX(0); }
          100% { transform: translateX(-64px); }
        }
        
        @keyframes smokeFloat {
          0% { 
            opacity: 0.6; 
            transform: translateX(0) translateY(0) scale(1);
          }
          100% { 
            opacity: 0; 
            transform: translateX(-20px) translateY(-10px) scale(1.5);
          }
        }
        
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .wheel-animation {
          animation: wheelSpin 0.2s linear infinite;
        }
      `}</style>
    </div>
  )
}

// Harley Davidson Style Motorcycle SVG
function HarleyBike() {
  return (
    <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back Wheel */}
      <g className="wheel-animation" style={{ transformOrigin: '32px 65px' }}>
        <circle cx="32" cy="65" r="22" stroke="#F59E0B" strokeWidth="4" fill="#1C1917"/>
        <circle cx="32" cy="65" r="14" stroke="#57534E" strokeWidth="2" fill="none"/>
        <circle cx="32" cy="65" r="5" fill="#F59E0B"/>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line 
            key={i}
            x1="32" y1="65" 
            x2={32 + 14 * Math.cos(angle * Math.PI / 180)} 
            y2={65 + 14 * Math.sin(angle * Math.PI / 180)}
            stroke="#57534E" strokeWidth="2"
          />
        ))}
      </g>

      {/* Front Wheel */}
      <g className="wheel-animation" style={{ transformOrigin: '140px 65px' }}>
        <circle cx="140" cy="65" r="22" stroke="#F59E0B" strokeWidth="4" fill="#1C1917"/>
        <circle cx="140" cy="65" r="14" stroke="#57534E" strokeWidth="2" fill="none"/>
        <circle cx="140" cy="65" r="5" fill="#F59E0B"/>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line 
            key={i}
            x1="140" y1="65" 
            x2={140 + 14 * Math.cos(angle * Math.PI / 180)} 
            y2={65 + 14 * Math.sin(angle * Math.PI / 180)}
            stroke="#57534E" strokeWidth="2"
          />
        ))}
      </g>

      {/* Frame */}
      <path d="M32 65 L50 38 L105 33 L140 65" stroke="#57534E" strokeWidth="4" fill="none"/>
      <path d="M50 38 L62 50 L32 65" stroke="#57534E" strokeWidth="3" fill="none"/>
      
      {/* Engine Block */}
      <path d="M50 42 L58 34 L68 42 L68 55 L50 55 Z" fill="#44403C"/>
      <rect x="52" y="44" width="5" height="9" rx="1" fill="#1C1917"/>
      <rect x="60" y="44" width="5" height="9" rx="1" fill="#1C1917"/>
      
      {/* Exhaust Pipes */}
      <path d="M50 52 Q38 54 28 68" stroke="#57534E" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="26" cy="70" rx="4" ry="3" fill="#F59E0B"/>
      
      {/* Gas Tank */}
      <path d="M62 28 Q85 20 102 28 L102 35 Q85 30 62 35 Z" fill="#1C1917"/>
      <path d="M66 30 Q85 24 98 30" stroke="#F59E0B" strokeWidth="2" fill="none"/>
      
      {/* Seat */}
      <path d="M55 32 Q68 26 90 28 L94 32 Q75 35 55 32" fill="#292524"/>
      
      {/* Handlebars */}
      <path d="M105 33 L112 15" stroke="#57534E" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M105 33 L98 18" stroke="#57534E" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="112" cy="13" r="3" fill="#F59E0B"/>
      <circle cx="98" cy="16" r="3" fill="#F59E0B"/>
      
      {/* Front Fork */}
      <path d="M112 22 L140 65" stroke="#57534E" strokeWidth="4" fill="none"/>
      <path d="M108 28 L135 65" stroke="#57534E" strokeWidth="3" fill="none"/>
      
      {/* Headlight */}
      <circle cx="145" cy="38" r="6" fill="#FEF3C7"/>
      <circle cx="145" cy="38" r="3" fill="#F59E0B"/>
      
      {/* Fenders */}
      <path d="M12 55 Q32 40 52 55" stroke="#1C1917" strokeWidth="5" fill="none"/>
      <path d="M120 55 Q140 40 160 55" stroke="#1C1917" strokeWidth="5" fill="none"/>

      {/* Rider */}
      <ellipse cx="72" cy="12" rx="6" ry="7" fill="#1C1917"/>
      <path d="M66 18 L62 36 L82 36 L78 18" fill="#1C1917"/>
      <path d="M62 36 L52 52" stroke="#1C1917" strokeWidth="5" strokeLinecap="round"/>
      <path d="M82 36 L100 28 L108 18" stroke="#1C1917" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Speed lines */}
      <line x1="0" y1="22" x2="15" y2="22" stroke="#F59E0B" strokeWidth="2" opacity="0.6"/>
      <line x1="3" y1="32" x2="18" y2="32" stroke="#F59E0B" strokeWidth="2" opacity="0.4"/>
      <line x1="0" y1="42" x2="12" y2="42" stroke="#F59E0B" strokeWidth="2" opacity="0.3"/>
    </svg>
  )
}

export default LoadingScreen
