import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  format: string;
  translations: any;
}

export const DownloadModal = ({ isOpen, onClose, videoId, format, translations }: DownloadModalProps) => {
  const [hasAdblock, setHasAdblock] = useState(false);

  useEffect(() => {
    const detectAdblock = () => {
      const adTest = document.createElement('div');
      adTest.innerHTML = '&nbsp;';
      adTest.className = 'adsbox';
      adTest.style.position = 'absolute';
      adTest.style.left = '-999px';
      document.body.appendChild(adTest);
      
      setTimeout(() => {
        if (adTest.offsetHeight === 0) {
          setHasAdblock(true);
        }
        document.body.removeChild(adTest);
      }, 100);
    };

    if (isOpen) {
      detectAdblock();
    }
  }, [isOpen]);

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
          
          {hasAdblock && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">
                Desbloquear o AdBlock para baixar o arquivo
              </p>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Clique após carregar, clique novamente
            </p>
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