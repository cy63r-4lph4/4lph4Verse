import { useState, useEffect } from 'react';

export function useCodenameAvailability(codename: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (codename.length < 3) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`http://127.0.0.1:4000/v1/gateway/check-username/${codename}`);
        const data = await response.json();
        
        // Assuming backend returns { available: true/false }
        setIsAvailable(data.available);
      } catch (error) {
        console.error("Radar Interference: Could not check codename", error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce: Wait 500ms after user stops typing
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [codename]);

  return { isAvailable, isChecking };
}