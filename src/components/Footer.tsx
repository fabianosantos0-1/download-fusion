import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FooterProps {
  adSpace1?: string;
  adSpace2?: string;
}

export const Footer = ({ adSpace1 = "", adSpace2 = "" }: FooterProps) => {
  const [giftCardCode, setGiftCardCode] = useState("");
  const { toast } = useToast();

  const redeemGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código de gift card",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', giftCardCode.toUpperCase())
      .eq('used', false)
      .single();

    if (error || !data) {
      toast({
        title: "Erro",
        description: "Gift card inválido ou já utilizado",
        variant: "destructive"
      });
      return;
    }

    // Marcar como usado
    const { error: updateError } = await supabase
      .from('gift_cards')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', data.id);

    if (updateError) {
      toast({
        title: "Erro",
        description: "Erro ao resgatar gift card",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Gift card resgatado com sucesso! Agora você tem acesso premium.",
    });

    setGiftCardCode("");
  };

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Gift Card Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resgatar Gift Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Digite seu código"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                className="font-mono"
              />
              <Button onClick={redeemGiftCard} className="w-full">
                Resgatar
              </Button>
            </CardContent>
          </Card>

          {/* Ad Space 1 */}
          <div className="flex items-center justify-center">
            {adSpace1 ? (
              <div 
                dangerouslySetInnerHTML={{ __html: adSpace1 }}
                className="w-full max-w-sm"
              />
            ) : (
              <div className="w-full max-w-sm h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Espaço para Anúncio 1
              </div>
            )}
          </div>

          {/* Ad Space 2 */}
          <div className="flex items-center justify-center">
            {adSpace2 ? (
              <div 
                dangerouslySetInnerHTML={{ __html: adSpace2 }}
                className="w-full max-w-sm"
              />
            ) : (
              <div className="w-full max-w-sm h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Espaço para Anúncio 2
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            © 2024 YouTube Downloader. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};