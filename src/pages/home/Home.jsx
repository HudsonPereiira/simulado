import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Crie este arquivo para estilos se desejar

function Home() {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Provas!</h1>
      <p>Escolha uma opção abaixo para começar:</p>
      <nav className="home-navigation">
        <Link to="/simulado" className="home-link-button">
          Iniciar Simulado
        </Link>
        <Link to="/treino" className="home-link-button">
          Modo Treino
        </Link>
      </nav>
    </div>
  );
}

export default Home;