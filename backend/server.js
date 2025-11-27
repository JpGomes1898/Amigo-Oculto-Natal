const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_REVELACAO = new Date(2025, 10, 1, 9, 0, 0); 

let participantes = [
    { id: 1,  nome: "Lúcia",      amigo: "Henrique",   senha: "107" },
    { id: 2,  nome: "Luiza",      amigo: "Beatriz",    senha: "715" },
    { id: 3,  nome: "João",       amigo: "Flávia",     senha: "778" },
    { id: 4,  nome: "Marquinhos", amigo: "Lara",       senha: "665" },
    { id: 5,  nome: "Lara",       amigo: "Junior",     senha: "409" },
    { id: 6,  nome: "Fernanda",   amigo: "Luiz",       senha: "222" },
    { id: 7,  nome: "Beatriz",    amigo: "Giovanna",   senha: "249" },
    { id: 8,  nome: "Junior",     amigo: "Claudia",    senha: "724" },
    { id: 9,  nome: "Claudia",    amigo: "João",       senha: "133" },
    { id: 10, nome: "Másio",      amigo: "Adriana",    senha: "688" },
    { id: 11, nome: "Adriana",    amigo: "Anna",       senha: "428" },
    { id: 12, nome: "Luiz",       amigo: "Fernanda",   senha: "383" },
    { id: 13, nome: "Giovanna",   amigo: "Marina",     senha: "920" },
    { id: 14, nome: "Marina",     amigo: "Luiza",      senha: "167" },
    { id: 15, nome: "Flávia",     amigo: "Marquinhos", senha: "711" },
    { id: 16, nome: "Henrique",   amigo: "Marcelo",    senha: "497" }, 
    { id: 17, nome: "Anna",       amigo: "Másio",      senha: "404" },
    { id: 18, nome: "Marcelo",    amigo: "Lúcia",      senha: "483" }
];

app.get('/api/participantes', (req, res) => {
    const listaPublica = participantes.map(p => ({ id: p.id, nome: p.nome }));
    res.json(listaPublica);
});

app.post('/api/revelar', (req, res) => {
    console.log("--- NOVA TENTATIVA DE LOGIN ---"); 

    const { idSolicitante, senha } = req.body;
    const agora = new Date();

    console.log("Tentando logar ID:", idSolicitante); 

    if (agora < DATA_REVELACAO) {
        console.log("Bloqueado por data.");
        return res.status(403).json({ erro: "Ainda não é Natal! Aguarde." });
    }

    const pessoa = participantes.find(p => p.id === Number(idSolicitante));
    
    if (!pessoa) {
        console.log("Pessoa não encontrada.");
        return res.status(404).json({ erro: "Pessoa não encontrada." });
    }

    const senhaDigitada = String(senha).trim();
    const senhaCorreta = String(pessoa.senha).trim();

    console.log(`Comparando: [${senhaDigitada}] com [${senhaCorreta}]`);

    if (senhaDigitada !== senhaCorreta) {
        console.log("Senha incorreta!");
        return res.status(401).json({ erro: "Senha incorreta! Tente novamente." });
    }

    console.log("Sucesso! Revelando amigo.");
    res.json({ amigo: pessoa.amigo });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));