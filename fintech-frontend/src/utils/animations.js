import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// export const reveal = (targets, trigger) => {
//   gsap.from(targets, {
//     opacity: 0,
//     y: 24,              
//     duration: 0.7,      
//     ease: "power3.out", 
//     stagger: 0.1,
//     scrollTrigger: {
//       trigger,
//       start: "top 80%",
//       once: true
//     }
//   });
// };

export const reveal = (selector, trigger) => {
  gsap.from(selector, {
    // opacity: 0.85,
    y: 20,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger,
      start: "top 80%",
      once: true
    }
  });
};

