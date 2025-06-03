import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Simulado.css';
import QuestoesSource from '../../components/questoes/Questoes'; // Ajuste o caminho se necessário

// ... (Componentes PainelQuestoes, Questao, Resultado, Timer e função shuffleArray permanecem os mesmos da última versão) ...
// Função para embaralhar o array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length;
  const newArray = [...array]; 
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

function PainelQuestoes({ totalQuestoes, respostas, questaoAtual, onNavegarParaQuestao }) {
  if (totalQuestoes === 0) return <p style={{textAlign: 'center', margin: '20px 0'}}>Carregando painel de questões...</p>;
  return (
    <div className="painel-questoes-container">
      <h4>Navegue pelas Questões:</h4>
      {Array.from({ length: totalQuestoes }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavegarParaQuestao(i)}
          className={`
            painel-questao-item
            ${respostas[i] !== null ? 'respondida' : 'nao-respondida'}
            ${i === questaoAtual ? 'atual' : ''}
          `}
          title={respostas[i] !== null ? `Questão ${i + 1} (Respondida)` : `Questão ${i + 1} (Não Respondida)`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

function Questao({ questao, questaoNumero, responderQuestao, respostaSelecionada }) {
  if (!questao) {
    return <div>Carregando questão...</div>;
  }
  return (
    <div className="simulado-questao">
      <h2>{questaoNumero}. {questao.enunciado || questao.questao}</h2> 
      <div className="simulado-alternativas">
        {(questao.alternativas || []).map((alternativa, index) => (
          <button
            key={index}
            className={`simulado-alternativa ${respostaSelecionada === index ? 'selecionada' : ''}`}
            onClick={() => responderQuestao(index)}
          >
            {String.fromCharCode(65 + index)}) {alternativa}
          </button>
        ))}
      </div>
    </div>
  );
}

function Resultado({ pontuacao, totalQuestoes, reiniciarSimulado }) {
  return (
    <div className="simulado-resultado">
      <h1>Resultado do Simulado</h1>
      <p>Você acertou {pontuacao} de {totalQuestoes} questões.</p>
      <button onClick={reiniciarSimulado}>Reiniciar Simulado</button>
    </div>
  );
}

function Timer({ tempoRestante, formatarTempo }) {
  return (
    <div className="simulado-timer">
      Tempo Restante: {formatarTempo(tempoRestante)}
    </div>
  );
}
// Fim dos componentes auxiliares

function Simulado() {
  const [questoesDoSimulado, setQuestoesDoSimulado] = useState([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [tempoRestante, setTempoRestante] = useState(5 * 3600); 
  const [simuladoConcluido, setSimuladoConcluido] = useState(false);
  const [respostaSelecionadaAtual, setRespostaSelecionadaAtual] = useState(null);
  
  // Novo estado para controlar a visibilidade do painel em mobile
  const [painelMobileVisivel, setPainelMobileVisivel] = useState(false);

  const MAX_QUESTOES_NO_SIMULADO = 100;

  const prepararNovoSimulado = useCallback(() => {
    if (Array.isArray(QuestoesSource) && QuestoesSource.length > 0) {
      const embaralhadas = shuffleArray(QuestoesSource);
      const selecionadas = embaralhadas.slice(0, Math.min(MAX_QUESTOES_NO_SIMULADO, embaralhadas.length));
      
      setQuestoesDoSimulado(selecionadas);
      setRespostas(Array(selecionadas.length).fill(null));
      setQuestaoAtual(0);
      setRespostaSelecionadaAtual(null);
    } else {
      setQuestoesDoSimulado([]);
      setRespostas([]);
    }
    setTempoRestante(5 * 3600);
    setSimuladoConcluido(false);
    setPainelMobileVisivel(false); // Reseta a visibilidade do painel mobile ao reiniciar
  }, []);

  useEffect(() => {
    prepararNovoSimulado();
  }, [prepararNovoSimulado]);

  useEffect(() => {
    if (simuladoConcluido || questoesDoSimulado.length === 0) return;
    if (tempoRestante <= 0) {
      setSimuladoConcluido(true);
      return;
    }
    const intervalId = setInterval(() => {
      setTempoRestante(prevTempo => prevTempo - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [tempoRestante, simuladoConcluido, questoesDoSimulado.length]);
  
  useEffect(() => {
      if(questoesDoSimulado.length > 0) {
        setRespostaSelecionadaAtual(respostas[questaoAtual]);
      }
  }, [questaoAtual, respostas, questoesDoSimulado]);

  const formatarTempo = (tempo) => {
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = tempo % 60;
    return (
      <>
        <span className="math-inline">{horas.toString().padStart(2, '0')}:</span>
        {minutos.toString().padStart(2, '0')}:
        {segundos.toString().padStart(2, '0')}
      </>
    );
  };

  const responderQuestao = (alternativaIndex) => {
    const novasRespostas = [...respostas];
    novasRespostas[questaoAtual] = alternativaIndex;
    setRespostas(novasRespostas);
    setRespostaSelecionadaAtual(alternativaIndex); 

    if (questaoAtual < questoesDoSimulado.length - 1) {
      // Avanço automático opcional, pode ser removido se preferir apenas manual
      // setTimeout(() => { 
      //   setQuestaoAtual(questaoAtual + 1);
      // }, 300);
    }
  };

  const todasQuestoesRespondidas = () => {
    if (questoesDoSimulado.length === 0) return true;
    return respostas.every(resposta => resposta !== null);
  };

  const ehUltimaQuestao = questoesDoSimulado.length > 0 && questaoAtual === questoesDoSimulado.length - 1;

  const proximaOuFinalizarQuestao = () => {
    if (!ehUltimaQuestao && questoesDoSimulado.length > 0) {
      setQuestaoAtual(questaoAtual + 1);
    } else {
      if (todasQuestoesRespondidas()) {
        setSimuladoConcluido(true);
      } else {
        alert("Por favor, responda todas as questões antes de finalizar o simulado.\nUse o painel de navegação para encontrar as questões pendentes.");
        const primeiraNaoRespondida = respostas.findIndex(r => r === null);
        if (primeiraNaoRespondida !== -1) {
          setQuestaoAtual(primeiraNaoRespondida);
        }
      }
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
    }
  };

  const navegarParaQuestao = (indiceQuestao) => {
    if (indiceQuestao >= 0 && indiceQuestao < questoesDoSimulado.length) {
      setQuestaoAtual(indiceQuestao);
    }
  };

  const calcularResultado = () => {
    if (questoesDoSimulado.length === 0) return 0;
    let pontuacao = 0;
    questoesDoSimulado.forEach((questao, index) => {
      if (respostas[index] === questao.respostaCorreta) {
        pontuacao++;
      }
    });
    return pontuacao;
  };

  const reiniciarSimulado = () => {
    prepararNovoSimulado();
  };

  // Função para alternar a visibilidade do painel em mobile
  const togglePainelMobile = () => {
    setPainelMobileVisivel(prevState => !prevState);
  };


  if (questoesDoSimulado.length === 0 && !simuladoConcluido) {
     return (
        <div className="simulado-container">
           
            <h1>Simulado</h1>
            <p>Nenhuma questão disponível ou carregando... Verifique o arquivo de questões.</p>
        </div>
    );
  }

  if (simuladoConcluido) {
    const pontuacao = calcularResultado();
    return (
        <div className="simulado-container">
           
            <Resultado pontuacao={pontuacao} totalQuestoes={questoesDoSimulado.length} reiniciarSimulado={reiniciarSimulado} />
        </div>
    );
  }
  
  return (
    <div className="simulado-container">
      
      <Timer tempoRestante={tempoRestante} formatarTempo={formatarTempo} />

      {/* Botão para mostrar/esconder painel em mobile */}
      <button className="botao-toggle-painel-mobile" onClick={togglePainelMobile}>
        {painelMobileVisivel ? 'Esconder Painel de Questões' : 'Navegue pelas Questões'}
      </button>

      {/* Painel de Questões com wrapper para controle de visibilidade mobile */}
      <div className={`painel-wrapper ${painelMobileVisivel ? 'painel-mobile-ativo' : ''}`}>
        <PainelQuestoes
          totalQuestoes={questoesDoSimulado.length}
          respostas={respostas}
          questaoAtual={questaoAtual}
          onNavegarParaQuestao={navegarParaQuestao}
        />
      </div>

      <Questao
        questao={questoesDoSimulado[questaoAtual]} 
        questaoNumero={questaoAtual + 1} 
        responderQuestao={responderQuestao}
        respostaSelecionada={respostaSelecionadaAtual} 
      />
  
      <div className="simulado-navegacao">
        <button onClick={questaoAnterior} disabled={questaoAtual === 0}>
          Questão Anterior
        </button>

        {/* Container para o link "Página Inicial" entre os botões - visível apenas em mobile */}
        <div className="link-home-entre-botoes-mobile">
          <Link to="/" className="link-estilizado">Página Inicial</Link>
        </div>

        <button
          onClick={proximaOuFinalizarQuestao}
          disabled={ehUltimaQuestao && !todasQuestoesRespondidas()} 
        >
          {ehUltimaQuestao || questoesDoSimulado.length === 0 ? 'Finalizar Simulado' : 'Próxima Questão'}
        </button>
      </div>
    </div>
  );
}

export default Simulado;