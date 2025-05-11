import { useEffect, useState } from "react";

export default function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      try {
        setIsTouchDevice(
          matchMedia("(pointer: coarse)").matches || "ontouchstart" in window
        );
      } catch {
        setIsTouchDevice(false);
      }
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  return isTouchDevice;
}
