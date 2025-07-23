import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";

interface VideoInputProps {
  onVideoSubmit: (videoId: string, format?: string) => void;
  format: string;
  translations: any;
  currentVideoId?: string;
}

export const VideoInput = ({ onVideoSubmit, format, translations, currentVideoId }: VideoInputProps) => {
  const [url, setUrl] = useState("");
  const [showDownload, setShowDownload] = useState(false);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error(translations.enterUrl);
      return;
    }

    const videoId = extractVideoId(url.trim());
    
    if (!videoId) {
      toast.error(translations.invalidUrl);
      return;
    }

    onVideoSubmit(videoId);
    setShowDownload(true);
  };

  const handleDownload = (downloadFormat: string) => {
    if (currentVideoId) {
      onVideoSubmit(currentVideoId, downloadFormat);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 h-12 text-base border-2 focus:border-primary"
        />
        <Button 
          type="submit" 
          className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <span className="hidden sm:inline mr-2">{translations.start}</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
      
      
      {currentVideoId && (
        <div className="mt-8 bg-card rounded-lg p-6 border shadow-lg">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={`https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full max-w-md rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`;
                }}
              />
            </div>
            
            <div className="flex gap-3 w-full max-w-xs">
              <Button 
                onClick={() => handleDownload('mp4')}
                className="flex-1 h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-lg font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {translations.downloadMp4}
              </Button>
              
              <Button 
                onClick={() => handleDownload('mp3')}
                className="flex-1 h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-lg font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {translations.downloadMp3}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {translations.termsMessage}{" "}
        <a href="#" className="text-primary hover:underline">
          {translations.termsOfService}
        </a>
      </div>
    </div>
  );
};