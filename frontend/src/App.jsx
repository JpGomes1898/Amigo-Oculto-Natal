// client/src/App.jsx
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

 
const baseURL = window.location.hostname.includes('localhost') 
  ? 'http://localhost:3001' 
  : 'https://amigo-secreto-api.onrender.com'; 

  const handleRevelar = async () => {
    if (!selecionado) return alert("Selecione seu nome!");
    if (!senha) return alert("Digite sua senha!"); 

    setLoading(true);
    setErro('');
    
    try {
      
      const response = await axios.post('http://localhost:3001/api/revelar', {
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
        setErro("Erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  const AreaDeRevelacao = () => (
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
          
          {}
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
  );

  const RendererCountdown = ({ completed, days, hours, minutes, seconds }) => {
    if (completed) return <AreaDeRevelacao />;
    return (
        <div className="container">
          <h1>🎄 Contagem Regressiva</h1>
          <div className="countdown-timer">{days}d {hours}h {minutes}m {seconds}s</div>
        </div>
    );
  };

  return (
    <>
      <Snowfall snowflakeCount={200} color="white" />
      <Countdown date={targetDate} renderer={RendererCountdown} />
    </>
  );
}

export default App;