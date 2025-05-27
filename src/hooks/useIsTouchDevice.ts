import { useEffect, useState } from "react";

const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = window.matchMedia("(pointer: coarse)");
      setIsTouch(match.matches);

      const updateMatch = () => setIsTouch(match.matches);
      match.addEventListener("change", updateMatch);

      return () => match.removeEventListener("change", updateMatch);
    }
  }, []);

  return isTouch;
};

export default useIsTouchDevice;
