import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

export const AdBlockDetector = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const detectAdBlock = () => {
      // Create a test element that looks like an ad
      const testAd = document.createElement('div');
      testAd.className = 'adsbygoogle ads ad-banner advertisement';
      testAd.style.position = 'absolute';
      testAd.style.top = '-1000px';
      testAd.style.left = '-1000px';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      
      document.body.appendChild(testAd);

      // Check if the element is hidden by AdBlock
      setTimeout(() => {
        const rect = testAd.getBoundingClientRect();
        const isBlocked = rect.height === 0 || 
                         window.getComputedStyle(testAd).display === 'none' ||
                         window.getComputedStyle(testAd).visibility === 'hidden';
        
        if (isBlocked) {
          setIsAdBlockEnabled(true);
          setShowWarning(true);
        }
        
        document.body.removeChild(testAd);
      }, 100);
    };

    detectAdBlock();
  }, []);

  const handleDisableAdBlock = () => {
    window.open('https://www.wikihow.com/Disable-Adblock', '_blank');
  };

  if (!showWarning || !isAdBlockEnabled) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center p-4">
      <Alert className="max-w-md w-full bg-card border-destructive">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                AdBlock Detectado
              </h3>
              <p className="text-sm text-muted-foreground">
                Para usar nosso serviço gratuito, por favor desative o AdBlock ou considere comprar um gift card premium.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWarning(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleDisableAdBlock}
              size="sm"
              className="flex-1"
            >
              Como Desativar
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/purchase'}
              size="sm"
              className="flex-1"
            >
              Comprar Premium
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};