import { useEffect, useRef, useState } from 'react';

const AnnouncementBanner = () => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    // Announcements to display - can be customized
    const announcements = [
        'FREE SHIPPING ON ORDERS OVER ₹2,999',
        '★',
        'NEW ARRIVALS EVERY WEEK',
        '★',
        'PREMIUM QUALITY GUARANTEED',
        '★',
        'EASY 7-DAY RETURNS',
        '★',
    ];

    // Create the scrolling text (repeat for seamless loop)
    const scrollText = [...announcements, ...announcements, ...announcements].join('   ');

    return (
        <div
            className="bg-black text-white overflow-hidden whitespace-nowrap"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                ref={scrollRef}
                className={`inline-block animate-marquee ${isPaused ? 'pause-animation' : ''}`}
                style={{
                    animationDuration: '40s',
                }}
            >
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-medium py-2.5 inline-block">
                    {scrollText}
                </span>
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-medium py-2.5 inline-block ml-8">
                    {scrollText}
                </span>
            </div>

            {/* CSS for marquee animation */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default AnnouncementBanner;
