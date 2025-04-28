import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUp({
  to,
  from = 0,
  duration = 2, // Duration of the animation in seconds
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(from);

  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 50,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, to, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          maximumFractionDigits: 0,
        }).format(latest.toFixed(0));
      }
    });

    return () => unsubscribe();
  }, [springValue]);

  return <span className={`${className}`} ref={ref} />;
}