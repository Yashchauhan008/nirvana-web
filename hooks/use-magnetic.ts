import { useRef } from "react";
import gsap from "gsap";

type UseMagneticOptions = {
  strength?: number;
};

export function useMagnetic<T extends HTMLElement>({ strength = 0.3 }: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);

  const onMove = (e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 1,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return { ref, onMove, onLeave };
}
