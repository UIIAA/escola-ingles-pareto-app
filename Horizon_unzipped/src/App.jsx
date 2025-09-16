import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Schedule from '@/pages/Schedule';

function App() {
  return (
    <>
      <Helmet>
        <title>Inglês Pareto - Agendamento de Aulas</title>
        <meta name="description" content="Plataforma de agendamento de aulas de inglês focada no método Pareto 80/20. Agende e gerencie suas aulas de forma eficiente." />
        <meta property="og:title" content="Inglês Pareto - Agendamento de Aulas" />
        <meta property="og:description" content="Plataforma de agendamento de aulas de inglês focada no método Pareto 80/20. Agende e gerencie suas aulas de forma eficiente." />
      </Helmet>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </>
  );
}

export default App;