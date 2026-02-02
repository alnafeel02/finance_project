import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const PageTransition = ({ children, className = '' }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;
