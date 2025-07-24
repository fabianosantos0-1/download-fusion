import { Button } from "@/components/ui/button";
import { Download, Globe, Moon, Sun, Palette } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: any;
}

type Theme = 'light' | 'dark' | 'neon';

export const Header = ({ language, setLanguage, translations }: HeaderProps) => {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.className = root.className.replace(/theme-\w+/, '');
    root.classList.add(`theme-${newTheme}`);
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'neon'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'neon': return <Palette className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-card shadow-card border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Y2Meta.co.za</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {translations.youtubeDownloader}
            </Link>
            <Link
              to="/mp4"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/mp4" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {translations.youtubeToMp4}
            </Link>
            <Link
              to="/mp3"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/mp3" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {translations.youtubeToMp3}
            </Link>
            <Link
              to="/purchase"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/purchase" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Gift Cards
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-colors"
            >
              {getThemeIcon()}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  {language === "en" ? "English" : 
                   language === "pt" ? "Português" : 
                   language === "es" ? "Español" :
                   language === "fr" ? "Français" :
                   language === "de" ? "Deutsch" :
                   language === "it" ? "Italiano" :
                   language === "ja" ? "日本語" :
                   language === "ko" ? "한국어" :
                   language === "zh" ? "中文" :
                   language === "ru" ? "Русский" :
                   language === "ar" ? "العربية" :
                   language === "hi" ? "हिन्दी" : "English"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("pt")}>Português</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("de")}>Deutsch</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("it")}>Italiano</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ja")}>日本語</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ko")}>한국어</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ru")}>Русский</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>العربية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")}>हिन्दी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};