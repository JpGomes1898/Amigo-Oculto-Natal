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

  const baseURL = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3001' 
    : 'https://amigo-oculto-okwo.onrender.com'; 

  useEffect(() => {
    if (new Date() > targetDate) {
      setTempoEsgotado(true);
    }

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
      setResultado(response.data.amigo);
      setSenha('');
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

  if (tempoEsgotado) {
    return (
      <>
        <Snowfall snowflakeCount={200} color="white" />
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
                style={{
                  padding: '12px',
                  fontSize: '1.2rem',
                  marginTop: '15px',
                  width: '100%', 
                  boxSizing: 'border-box', 
                  borderRadius: '10px',
                  border: '2px solid #d63031',
                  color: '#d63031',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              />
              
              <button onClick={handleRevelar} disabled={loading}>
                {loading ? 'Verificando...' : 'Revelar'}
              </button>
              
              {erro && <p style={{color: '#d63031', marginTop: '10px', fontWeight: 'bold'}}>{erro}</p>}

              {}
              <a 
                href="https://wa.me/5521990458504?text=Esqueci%20minha%20senha!" 
                target="_blank"
                style={{display: 'block', marginTop: '20px', color: '#d63031', fontSize: '0.9rem'}}
              >
                Esqueceu a senha? Me chame no Zap 🆘
              </a>
            </>
          ) : (
            <div className="result-card">
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

  // 2. SE O TEMPO NÃO ACABOU (MOSTRA O CONTADOR)
  return (
    <>
      <Snowfall snowflakeCount={200} color="white" />
      <Countdown 
        date={targetDate} 
        onComplete={() => setTempoEsgotado(true)} // Quando zerar, muda a tela automaticamente
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