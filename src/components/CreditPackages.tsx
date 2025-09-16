import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check } from "lucide-react";

const CreditPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Pacotes de créditos com descontos
  const creditPackages = [
    { credits: 4, discount: 0, price: 200 },
    { credits: 8, discount: 0, price: 400 },
    { credits: 12, discount: 5, price: 570 },
    { credits: 16, discount: 5, price: 760 },
    { credits: 20, discount: 5, price: 950 },
    { credits: 24, discount: 10, price: 1080 },
    { credits: 28, discount: 10, price: 1260 },
    { credits: 32, discount: 10, price: 1440 },
    { credits: 36, discount: 15, price: 1530 },
    { credits: 40, discount: 15, price: 1700 },
    { credits: 44, discount: 15, price: 1870 },
    { credits: 48, discount: 15, price: 2040 },
    { credits: 52, discount: 20, price: 2080 },
  ];

  const popularPackages = [12, 24, 36, 52];

  const handlePurchase = () => {
    if (selectedPackage !== null) {
      const pkg = creditPackages[selectedPackage];
      alert(`Compra de ${pkg.credits} créditos confirmada! Valor: R$ ${pkg.price},00`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creditPackages.map((pkg, index) => (
          <Card 
            key={pkg.credits}
            className={`cursor-pointer transition-all ${selectedPackage === index ? "border-primary ring-2 ring-primary/20" : ""}`}
            onClick={() => setSelectedPackage(index)}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-center">{pkg.credits} Aulas</CardTitle>
              <CardDescription className="text-center">
                {pkg.credits === 1 ? "Aula Individual" : "Pacote de Aulas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold">R$ {pkg.price}<span className="text-lg">,00</span></div>
                {pkg.discount > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    {pkg.discount}% de desconto
                  </Badge>
                )}
                {popularPackages.includes(pkg.credits) && (
                  <Badge className="mt-2 ml-2">Popular</Badge>
                )}
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Acesso a todos os professores</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Agendamento flexível</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Materiais complementares</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant={selectedPackage === index ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPackage(index);
                }}
              >
                {selectedPackage === index ? "Selecionado" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Finalizar Compra
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPackage !== null ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Pacote selecionado</h3>
                  <p className="text-sm text-muted-foreground">
                    {creditPackages[selectedPackage].credits} aulas com {creditPackages[selectedPackage].discount}% de desconto
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">R$ {creditPackages[selectedPackage].price},00</div>
                  {creditPackages[selectedPackage].discount > 0 && (
                    <div className="text-sm text-green-600">
                      Economia de R$ {creditPackages[selectedPackage].credits * 50 - creditPackages[selectedPackage].price},00
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  onClick={handlePurchase}
                >
                  Confirmar Compra
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedPackage(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Nenhum pacote selecionado</h3>
              <p className="text-muted-foreground mb-4">
                Escolha um pacote de créditos acima para finalizar sua compra
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditPackages;