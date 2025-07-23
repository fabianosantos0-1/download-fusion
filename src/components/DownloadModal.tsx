import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  format: string;
  translations: any;
}

export const DownloadModal = ({ isOpen, onClose, videoId, format, translations }: DownloadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {translations.downloadVideo}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {translations.downloadMessage}
          </p>
          
          <div className="bg-muted rounded-lg p-4">
            <iframe
              src={`https://apiyt.cc/${format}/${videoId}`}
              style={{ width: "100%", height: "60px", border: "none" }}
              allowTransparency={true}
              scrolling="no"
              title="Download Frame"
            />
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            {translations.processingNote}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};