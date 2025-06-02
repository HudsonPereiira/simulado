import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';


import Home from './pages/home/Home';
import Simulado from './pages/simulado/Simulado';
import Treino from './pages/treino/Treino';

import './App.css'; // Para estilos globais, se houver

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Você pode adicionar um cabeçalho ou menu de navegação global aqui, se desejar */}
        {/* Exemplo de um menu global simples:
        <header className="app-header">
          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/simulado">Simulado</RouterLink>
            <RouterLink to="/treino">Treino</RouterLink>
          </nav>
        </header>
        */}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulado" element={<Simulado />} />
            <Route path="/treino" element={<Treino />} />
            {/* Você pode adicionar uma rota '*' para uma página Not Found (404) aqui também */}
            {/* <Route path="*" element={<div>Página Não Encontrada</div>} /> */}
          </Routes>
        </main>

        {/* Você pode adicionar um rodapé global aqui, se desejar
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Seu Sistema de Provas</p>
        </footer>
        */}
      </div>
    </Router>
  );
}

export default App;