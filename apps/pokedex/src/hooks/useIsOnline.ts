import { useEffect, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    return onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });
  }, []);

  return isOnline;
}
