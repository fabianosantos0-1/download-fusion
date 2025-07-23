import { Button } from "@/components/ui/button";
import { Download, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

export const Header = ({ language, setLanguage, translations }: HeaderProps) => {
  const location = useLocation();

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
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                {language === "en" ? "English" : language === "pt" ? "Português" : "Español"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("pt")}>
                Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};