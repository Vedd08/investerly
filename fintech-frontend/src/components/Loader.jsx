import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import lottie from "lottie-web";
import "../styles/loader.css";
import investerlyLogoAnim from "../assets/lotties/investerly-logo.json";

const Loader = ({ visible }) => {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Only run when visible becomes true (initial load)
    if (visible && containerRef.current && !animationStarted) {
      console.log("🎬 Starting loader animation");
      setAnimationStarted(true);

      // Destroy previous animation if exists
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      // Load Lottie animation with error handling
      try {
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: investerlyLogoAnim,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
            hideOnTransparent: true
          }
        });

        // Animation event listeners
        animationRef.current.addEventListener('DOMLoaded', () => {
          console.log('✅ Lottie animation loaded');
          
          // Start GSAP timeline for enhanced effects
          const tl = gsap.timeline();
          
          // Animate progress bar in sync with Lottie
          tl.to(progressRef.current, {
            width: '100%',
            duration: 2.2, // Slightly shorter to ensure completion
            ease: "power2.inOut",
            onUpdate: function() {
              if (textRef.current) {
                const percent = Math.min(Math.round(this.progress() * 100), 100);
                textRef.current.textContent = `${percent}%`;
              }
            }
          });
          
          // Subtle scale animation on logo wrapper
          tl.fromTo(containerRef.current, 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
            0
          );
        });

        animationRef.current.addEventListener('error', (error) => {
          console.error('Lottie animation error:', error);
          // Fallback - ensure loader still completes
          gsap.to(progressRef.current, {
            width: '100%',
            duration: 2,
            ease: "power2.inOut"
          });
        });

      } catch (error) {
        console.error("Failed to load Lottie:", error);
      }

      // Show overlay with smooth entrance
      gsap.set(overlayRef.current, { 
        display: 'flex', 
        opacity: 0,
        backgroundColor: '#0B1A33' 
      });
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
      });

    } else if (!visible && overlayRef.current) {
      // Exit animation when loader should hide
      console.log("👋 Hiding loader");
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none' });
          // Clean up animation
          if (animationRef.current) {
            animationRef.current.destroy();
            animationRef.current = null;
          }
          setAnimationStarted(false);
        }
      });
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [visible, animationStarted]);

  return (
    <div 
      ref={overlayRef} 
      className="investerly-loader-overlay"
      style={{ 
        display: 'none', // Initially hidden
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0B1A33',
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="loader-container">
        {/* Animated background gradient */}
        <div className="loader-bg-gradient"></div>
        
        {/* Main content */}
        <div className="loader-content">
          {/* Logo animation container */}
          <div className="logo-wrapper">
            <div 
              ref={containerRef} 
              className="lottie-container"
            ></div>
          </div>

          {/* Progress section */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div 
                ref={progressRef} 
                className="progress-bar-fill"
                style={{ width: '0%' }}
              ></div>
            </div>
            
            <div className="progress-stats">
              <span ref={textRef} className="progress-percentage">0%</span>
              <span className="progress-label">Preparing your experience</span>
            </div>
          </div>

          {/* Brand message with animation */}
          <div className="brand-message">
            <span className="brand-name">Investerly</span>
            <span className="brand-tagline">Smart investments, smarter future</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="loader-decoration top-right"></div>
        <div className="loader-decoration bottom-left"></div>
      </div>
    </div>
  );
};

export default Loader;