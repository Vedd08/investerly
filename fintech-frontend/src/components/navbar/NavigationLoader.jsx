import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import "../../styles/loader.css";

const NavigationLoader = () => {
  const location = useLocation();
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only show loader on actual navigation (path change)
    if (prevPathRef.current !== location.pathname) {
      // Show loader
      gsap.set(loaderRef.current, { display: 'flex', opacity: 1 });
      
      // Animate progress bar
      gsap.fromTo(progressRef.current,
        { width: "0%" },
        {
          width: "100%",
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(loaderRef.current, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                gsap.set(loaderRef.current, { display: 'none' });
              }
            });
          }
        }
      );

      // Update previous path
      prevPathRef.current = location.pathname;
    }
  }, [location]);

  return (
    <div className="navigation-loader" ref={loaderRef}>
      <div className="navigation-loader-content">
        <div className="mini-logo">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="navigation-progress">
          <div className="navigation-progress-bar" ref={progressRef}></div>
        </div>
      </div>
    </div>
  );
};

export default NavigationLoader;