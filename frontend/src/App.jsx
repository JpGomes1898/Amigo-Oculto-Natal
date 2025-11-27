import React, { useState, useEffect } from 'react';
import Snowfall from 'react-snowfall';
import Countdown from 'react-countdown';
import axios from 'axios';
import './App.css';

function App() {
  const targetDate = new Date('2025-11-01T09:00:00');
  
  const [participantes, setParticipantes] = useState([]);
  const [selecionado, setSelecionado] = useState('');
  const [senha, setSenha] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [tempoEsgotado, setTempoEsgotado] = useState(false);
  const [mostrandoAnimacao, setMostrandoAnimacao] = useState(false);
  const baseURL = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3001' 
    : 'https://amigo-oculto-okwo.onrender.com'; 

  useEffect(() => {
    if (new Date() > targetDate) setTempoEsgotado(true);

    axios.get(`${baseURL}/api/participantes`) 
      .then(res => setParticipantes(res.data))
      .catch(err => {
        console.error(err);
        setErro("Erro ao conectar com servidor.");
      });
  }, []);

  const handleRevelar = async () => {
    if (!selecionado) return alert("Selecione seu nome!");
    if (!senha) return alert("Digite sua senha!"); 

    setLoading(true);
    setErro('');
    
    try {
      const response = await axios.post(`${baseURL}/api/revelar`, {
        idSolicitante: selecionado,
        senha: senha
      });

      setMostrandoAnimacao(true);
      setTimeout(() => {
        setMostrandoAnimacao(false);
        setResultado(response.data.amigo);
        setSenha('');
      }, 3500);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErro("🔒 Senha incorreta. Tente novamente.");
      } else if (error.response && error.response.status === 403) {
        setErro("🎄 Ainda não é hora!");
      } else {
        setErro("Erro de conexão. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const TelaAnimacao = () => (
    <div className="overlay-animacao">
      <div className="bola-natal">🎄🔮</div>
      <div className="texto-suspense">Sorteando...</div>
      <Snowfall snowflakeCount={400} speed={[2, 4]} wind={[-1, 1]} />
    </div>
  );

  if (tempoEsgotado) {
    return (
      <>
        <Snowfall snowflakeCount={200} color="white" />
        
        {}
        {mostrandoAnimacao && <TelaAnimacao />}

        <div className="container">
          <h1>🎅 Amigo Oculto</h1>
          
          {!resultado ? (
            <>
              <p>Selecione seu nome e digite sua senha:</p>
              
              <select 
                onChange={(e) => setSelecionado(e.target.value)} 
                value={selecionado}
              >
                <option value="">Quem é você?</option>
                {participantes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              
              <input 
                type="password" 
                placeholder="Sua Senha (PIN)"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              
              <button onClick={handleRevelar} disabled={loading}>
                {loading ? 'Consultando...' : 'Revelar'}
              </button>
              
              {erro && <p style={{color: '#d63031', marginTop: '10px', fontWeight: 'bold'}}>{erro}</p>}

              <a 
                href="https://wa.me/5521990458504?text=Esqueci%20minha%20senha!" 
                target="_blank"
              >
                Esqueceu a senha? Me chame no Zap 🆘
              </a>
            </>
          ) : (
            <div className="result-card resultado-final-animado">
              <p style={{color: '#636e72', fontSize: '1rem'}}>Você tirou:</p>
              <div className="result-name">{resultado}</div>
              <button onClick={() => setResultado(null)} style={{marginTop: '15px', background: '#636e72'}}>
                Voltar
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Snowfall snowflakeCount={200} color="white" />
      <Countdown 
        date={targetDate} 
        onComplete={() => setTempoEsgotado(true)}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="container">
            <h1>🎄 Contagem Regressiva</h1>
            <div className="countdown-timer">{days}d {hours}h {minutes}m {seconds}s</div>
            <p style={{marginTop: '1rem', fontStyle: 'italic', opacity: 0.8}}>
                Prepare o coração...
            </p>
          </div>
        )} 
      />
    </>
  );
}

export default App;