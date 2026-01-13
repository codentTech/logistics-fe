import { useEffect, useState } from "react";

function useBackgroundEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Interactive background effect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseMove = (e) => {
        setPosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return { position };
}

export default useBackgroundEffect;
