import { useRef, useState, useEffect, RefObject } from "react";

// Define a custom hook that returns the height of an element
export function useElementHeight(): [RefObject<HTMLDivElement>, number] {

  const elementRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);

  // Use the useEffect hook to create and clean up the ResizeObserver
  useEffect(() => {
    if (elementRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // Update the height state variable with the new height
          setHeight(entry.contentRect.height);
        }
      });

      observer.observe(elementRef.current);

      // Return a cleanup function to unobserve the element
      return () => {
        if (elementRef.current) observer.unobserve(elementRef.current);
      };
    }
  }, []);

  return [elementRef, height];
}
