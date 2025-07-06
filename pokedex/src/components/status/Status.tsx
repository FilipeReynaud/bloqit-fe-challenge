import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui';

export interface StatusProps {
  /**
   * Wether the application is running online or offline.
   * @default false
   */
  isOnline?: boolean;
}

export const Status = ({ isOnline = false }: StatusProps) => {
  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <Badge variant="outline" className="text-green-600">
          <Wifi className="w-4 h-4 mr-1" />
          Online
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-600">
          <WifiOff className="w-4 h-4 mr-1" />
          Offline
        </Badge>
      )}
    </div>
  );
};
