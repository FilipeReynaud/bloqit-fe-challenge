import { useState } from 'react';
import { Share2, Copy } from 'lucide-react';
import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui';

export interface SharePopoverProps {
  shareableUrl: string;
}

export const SharePopover = ({ shareableUrl }: SharePopoverProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const onShare = () => {
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Shareable link</h4>
            <p className="text-muted-foreground text-sm">
              The following is a public link that can be accessed by everyone.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              id="url"
              defaultValue="100%"
              className="h-8"
              value={shareableUrl}
              disabled
            />
            {isCopied ? (
              <span className="text-xs items-center content-center">
                Copied!
              </span>
            ) : (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Copy className="" />
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
