import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoInput } from "@/components/VideoInput";
import { DownloadModal } from "@/components/DownloadModal";
import { translations } from "@/utils/translations";

const MP4Page = () => {
  const [language, setLanguage] = useState("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");

  const currentTranslations = translations[language as keyof typeof translations];

  const handleVideoSubmit = (id: string) => {
    setVideoId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        translations={currentTranslations} 
      />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {currentTranslations.youtubeToMp4Converter}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentTranslations.downloadConvertDescription}
          </p>
        </div>

        <div className="mb-16">
          <VideoInput
            onVideoSubmit={handleVideoSubmit}
            format="mp4"
            translations={currentTranslations}
            currentVideoId={videoId}
          />
        </div>

        <div className="bg-card rounded-xl shadow-card p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {currentTranslations.bestYouTubeConverter}
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">YouTube to MP4 Converter</strong> {currentTranslations.youTubeConverterDescription}
            </p>
            
            <p>
              {currentTranslations.toolDescription}
            </p>
          </div>
        </div>
      </main>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={videoId}
        format="mp4"
        translations={currentTranslations}
      />
    </div>
  );
};

export default MP4Page;