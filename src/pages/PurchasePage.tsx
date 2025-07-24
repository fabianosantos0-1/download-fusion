import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { translations } from "@/utils/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  duration_type: string;
  price: number;
}

const PurchasePage = () => {
  const [language, setLanguage] = useState("en");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentTranslations = translations[language as keyof typeof translations];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price');
    
    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }

    setPlans(data || []);
  };

  const handlePurchase = async () => {
    if (!selectedPlan || !email) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um plano e informe seu email",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Criar transação no banco
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .insert({
          subscription_plan_id: selectedPlan.id,
          email: email,
          amount: selectedPlan.price,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Aqui seria integrado com Mercado Pago
      // Por enquanto simularemos o pagamento
      toast({
        title: "Pagamento iniciado",
        description: "Você será redirecionado para o Mercado Pago em breve",
      });

    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeColor = (durationType: string) => {
    switch (durationType) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-green-500';
      case 'monthly': return 'bg-purple-500';
      case 'quarterly': return 'bg-orange-500';
      case 'annual': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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
            Gift Cards Premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compre gift cards para acessar downloads sem anúncios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <span 
                    className={`px-2 py-1 rounded text-white text-xs ${getPlanBadgeColor(plan.duration_type)}`}
                  >
                    {plan.duration_type}
                  </span>
                </div>
                <CardDescription>
                  Acesso premium por {plan.duration_type === 'daily' ? '1 dia' : 
                    plan.duration_type === 'weekly' ? '1 semana' :
                    plan.duration_type === 'monthly' ? '1 mês' :
                    plan.duration_type === 'quarterly' ? '3 meses' : '1 ano'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">
                    R$ {plan.price.toFixed(2)}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>✓ Downloads sem anúncios</li>
                  <li>✓ Velocidade máxima</li>
                  <li>✓ Suporte prioritário</li>
                  <li>✓ Sem limitações</li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Finalizar Compra</CardTitle>
              <CardDescription>
                {selectedPlan.name} - R$ {selectedPlan.price.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email para envio do Gift Card</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <Button 
                onClick={handlePurchase}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Processando..." : "Pagar com Mercado Pago"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PurchasePage;