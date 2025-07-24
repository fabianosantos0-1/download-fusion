import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [adSpace1, setAdSpace1] = useState("");
  const [adSpace2, setAdSpace2] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlans();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // Simular login por enquanto
    if (username === "administrator" && password === "Fafa@gmail.com") {
      setIsAuthenticated(true);
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Erro",
        description: "Credenciais inválidas",
        variant: "destructive"
      });
    }
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price');
    
    if (!error && data) {
      setPlans(data);
    }
  };

  const fetchSettings = async () => {
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

  const updatePlanPrice = async (planId: string, newPrice: number) => {
    const { error } = await supabase
      .from('subscription_plans')
      .update({ price: newPrice })
      .eq('id', planId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar preço",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Preço atualizado com sucesso",
      });
      fetchPlans();
    }
  };

  const saveAdSettings = async () => {
    const updates = [
      { setting_key: 'ad_space_1', setting_value: adSpace1 },
      { setting_key: 'ad_space_2', setting_value: adSpace2 }
    ];

    for (const update of updates) {
      await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'setting_key' });
    }

    toast({
      title: "Sucesso",
      description: "Configurações de anúncios salvas",
    });
  };

  const generateGiftCard = async (planId: string, email: string) => {
    const code = Math.random().toString(36).substring(2, 18).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error } = await supabase
      .from('gift_cards')
      .insert({
        code,
        subscription_plan_id: planId,
        email,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar gift card",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: `Gift card gerado: ${code}`,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Administrativo</CardTitle>
            <CardDescription>Entre com suas credenciais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="administrator"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Fafa@gmail.com"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Sair
          </Button>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
            <TabsTrigger value="ads">Anúncios</TabsTrigger>
            <TabsTrigger value="resellers">Revendedores</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid gap-4">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.duration_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={plan.price}
                        onBlur={(e) => {
                          const newPrice = parseFloat(e.target.value);
                          if (newPrice !== plan.price) {
                            updatePlanPrice(plan.id, newPrice);
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="giftcards">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Gift Card</CardTitle>
                <CardDescription>Crie gift cards manualmente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plano</Label>
                  <select className="w-full p-2 border rounded">
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input placeholder="email@exemplo.com" />
                </div>
                <Button onClick={() => plans.length > 0 && generateGiftCard(plans[0].id, "test@test.com")}>
                  Gerar Gift Card
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Espaço de Anúncio 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label>HTML/CSS do Anúncio</Label>
                  <textarea
                    className="w-full h-32 p-2 border rounded"
                    value={adSpace1}
                    onChange={(e) => setAdSpace1(e.target.value)}
                    placeholder="Cole aqui o código do anúncio"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Espaço de Anúncio 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label>HTML/CSS do Anúncio</Label>
                  <textarea
                    className="w-full h-32 p-2 border rounded"
                    value={adSpace2}
                    onChange={(e) => setAdSpace2(e.target.value)}
                    placeholder="Cole aqui o código do anúncio"
                  />
                </CardContent>
              </Card>

              <Button onClick={saveAdSettings}>
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="resellers">
            <Card>
              <CardHeader>
                <CardTitle>Painel de Revendedores</CardTitle>
                <CardDescription>Em desenvolvimento</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;