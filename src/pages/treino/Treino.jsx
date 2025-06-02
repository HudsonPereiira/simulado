import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// Caminho para o seu arquivo de Questoes (mantido como você forneceu)
import Questoes from '../../components/questoes/Questoes';
// Caminho para o seu simulado.css (mantido como você forneceu)
// Certifique-se de que este caminho está correto para a sua estrutura de pastas.
// Se Treino.js está em 'src/pages/' e simulado.css em 'src/components/Simulado/',
// o caminho seria '../components/Simulado/simulado.css'
import '../Simulado/simulado.css';

function Treino() {
  const [questoesOriginais, setQuestoesOriginais] = useState([]);
  const [questoesEmbaralhadas, setQuestoesEmbaralhadas] = useState([]);
  const [indiceAtualNoArrayEmbaralhado, setIndiceAtualNoArrayEmbaralhado] = useState(0);
  const [questaoAtualObj, setQuestaoAtualObj] = useState(null);
  
  const [respostaSelecionadaUsuario, setRespostaSelecionadaUsuario] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const shuffleArray = useCallback((array) => {
    let currentIndex = array.length;
    const newArray = [...array];
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [
        newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  }, []);

  useEffect(() => {
    if (Array.isArray(Questoes) && Questoes.length > 0) {
      setQuestoesOriginais(Questoes);
      const embaralhadas = shuffleArray(Questoes);
      setQuestoesEmbaralhadas(embaralhadas);
      setQuestaoAtualObj(embaralhadas[0]);
      setIndiceAtualNoArrayEmbaralhado(0);
    }
  }, [shuffleArray]);

  const handleSelecionarResposta = (indexAlternativa) => {
    if (mostrarFeedback || !questaoAtualObj) return;

    setRespostaSelecionadaUsuario(indexAlternativa);
    if (indexAlternativa === questaoAtualObj.respostaCorreta) {
      setFeedbackMsg('Correto!');
    } else {
      const letraCorreta = String.fromCharCode(65 + questaoAtualObj.respostaCorreta);
      const textoAlternativaCorreta = questaoAtualObj.alternativas[questaoAtualObj.respostaCorreta];
      setFeedbackMsg(`Errado! A resposta correta era: ${letraCorreta}) ${textoAlternativaCorreta}`);
    }
    setMostrarFeedback(true);
  };

  const handleProximaQuestao = () => {
    setMostrarFeedback(false);
    setFeedbackMsg('');
    setRespostaSelecionadaUsuario(null);

    let proximoIndice = indiceAtualNoArrayEmbaralhado + 1;

    if (proximoIndice >= questoesEmbaralhadas.length) {
      const novasQuestoesEmbaralhadas = shuffleArray(questoesOriginais);
      setQuestoesEmbaralhadas(novasQuestoesEmbaralhadas);
      setQuestaoAtualObj(novasQuestoesEmbaralhadas[0]);
      setIndiceAtualNoArrayEmbaralhado(0);
    } else {
      setQuestaoAtualObj(questoesEmbaralhadas[proximoIndice]);
      setIndiceAtualNoArrayEmbaralhado(proximoIndice);
    }
  };

  if (!Array.isArray(Questoes) || Questoes.length === 0) {
    return (
      // Usando a classe do simulado para o container
      <div className="simulado-container"> 
        <h1>Modo Treino</h1>
        <p>Nenhuma questão encontrada. Verifique o arquivo de questões.</p>
        {/* Mantendo a classe específica para o link, pois o estilo já foi adicionado ao simulado.css */}
        <div className="voltar-home-link-treino">
            <Link to="/">Página Inicial</Link>
        </div>
      </div>
    );
  }

  if (!questaoAtualObj) {
    return (
      // Usando a classe do simulado para o container
      <div className="simulado-container">
        <h1>Modo Treino</h1>
        <p>Carregando questões...</p>
        <div className="voltar-home-link-treino">
            <Link to="/">Página Inicial</Link>
        </div>
      </div>
    );
  }

  return (
    // Usando a classe do simulado para o container principal
    <div className="simulado-container"> 
      <h1>Modo Treino</h1>
      {/* Usando a classe do simulado para o container da questão */}
      <div className="simulado-questao"> 
        <h2>{questaoAtualObj.enunciado || questaoAtualObj.questao}</h2>
        {/* Usando a classe do simulado para o container das alternativas */}
        <div className="simulado-alternativas"> 
          {(questaoAtualObj.alternativas || []).map((alternativa, index) => {
            // Usando a classe base do simulado para as alternativas
            let classNameAlternativa = 'simulado-alternativa'; 
            if (mostrarFeedback) {
              if (index === questaoAtualObj.respostaCorreta) {
                classNameAlternativa += ' correta';
              }
              if (index === respostaSelecionadaUsuario && index !== questaoAtualObj.respostaCorreta) {
                classNameAlternativa += ' errada-selecionada';
              }
            }
            return (
              <button
                key={index}
                onClick={() => handleSelecionarResposta(index)}
                disabled={mostrarFeedback}
                className={classNameAlternativa} // Aplicando as classes corretas
              >
                {String.fromCharCode(65 + index)}) {alternativa}
              </button>
            );
          })}
        </div>
      </div>

      {mostrarFeedback && (
        // Usando a classe genérica para o container de feedback
        <div className="feedback-container" > 
          <p className={feedbackMsg === 'Correto!' ? 'feedback-correto' : 'feedback-errado'}>
            {feedbackMsg}
          </p>
          {/* O botão "Próxima Questão" será estilizado por '.feedback-container button' no CSS */}
          <button onClick={handleProximaQuestao} style={{ backgroundColor: '#4caf50'}}> 
            Próxima Questão
          </button>
        </div>
      )}

      {/* Mantendo a classe específica para o link, pois o estilo já foi adicionado ao simulado.css */}
      <div className="voltar-home-link-treino">
        <Link to="/">Página Inicial</Link>
      </div>
    </div>
  );
}

export default Treino;