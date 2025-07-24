import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoInput } from "@/components/VideoInput";
import { DownloadModal } from "@/components/DownloadModal";
import { Footer } from "@/components/Footer";
import { AdBlockDetector } from "@/components/AdBlockDetector";
import { translations } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [language, setLanguage] = useState("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [adSpace1, setAdSpace1] = useState("");
  const [adSpace2, setAdSpace2] = useState("");

  const currentTranslations = translations[language as keyof typeof translations];

  useEffect(() => {
    fetchAdSettings();
  }, []);

  const fetchAdSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .in('setting_key', ['ad_space_1', 'ad_space_2']);
    
    if (!error && data) {
      const ad1 = data.find(s => s.setting_key === 'ad_space_1');
      const ad2 = data.find(s => s.setting_key === 'ad_space_2');
      setAdSpace1(ad1?.setting_value || '');
      setAdSpace2(ad2?.setting_value || '');
    }
  };

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
            {currentTranslations.youtubeDownloaderTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentTranslations.downloadConvertGenericDescription}
          </p>
        </div>

        <div className="mb-16">
          <VideoInput
            onVideoSubmit={handleVideoSubmit}
            format="mp4"
            translations={currentTranslations}
          />
        </div>

        <div className="bg-card rounded-xl shadow-card p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {currentTranslations.bestYouTubeDownloader}
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">YouTube Downloader</strong> {currentTranslations.youTubeDownloaderDescription}
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

      <Footer adSpace1={adSpace1} adSpace2={adSpace2} />
      <AdBlockDetector />
    </div>
  );
};

export default Index;
