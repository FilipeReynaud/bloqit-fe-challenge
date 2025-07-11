import { useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';

export const OnlineManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      function onOnline() {
        setOnline(true);
      }
      function onOffline() {
        setOnline(false);
      }

      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);

      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    });
  }, []);

  return <>{children}</>;
};
