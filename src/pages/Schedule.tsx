import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentBooking from "@/components/StudentBooking";
import CreditBalance from "@/components/CreditBalance";

const Schedule = () => {
  const handleBuyCredits = () => {
    alert("Redirecionar para a página de compra de créditos");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Agendamento de Aulas</h1>
          <p className="text-muted-foreground">
            Escolha uma data e horário para sua próxima aula
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StudentBooking />
        </div>

        <div>
          <CreditBalance credits={8} onBuyCredits={handleBuyCredits} />
        </div>
      </div>
    </div>
  );
};

export default Schedule;