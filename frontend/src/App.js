import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

let socket;

function App() {

  const ENDPOINT = "http://localhost:3004";

  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState("");
  const [sala, setSala] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [listaMensagem, setListaMensagem] = useState([]);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
  }, [])

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      setListaMensagem([...listaMensagem, dados]);
    })
  })

  const conectarSala = () => {
    console.log(`Acessou a sala ${sala} com o usuário ${nome}`);
    setLogado(true);
    socket.emit("sala_conectar", sala);
  }

  const enviarMensagem = async () => {
    console.log("Mensagem"+ mensagem);

    const conteudoMensagem = {
      sala,
      conteudo: {
        nome,
        mensagem
      }
    }

    console.log(conteudoMensagem);

    await socket.emit("enviar_mensagem", conteudoMensagem);
    setListaMensagem([...listaMensagem, conteudoMensagem.conteudo]);
    setMensagem("");
  }

  return (
    <div className="App">
      <h1> Chat </h1>
      {!logado ? <>
        <label>Nome: </label>
        <input type="text" placeholder="Nome" name="nome" value={nome} onChange={(text) => { setNome(text.target.value) }} />
        <br />
        <br />

        <label>Sala: </label>
        <select name="sala" value={sala} onChange={texto => setSala(texto.target.value)}>
          <option value="">Selecione</option>
          <option value="1">Node.js</option>
          <option value="2">React</option>
          <option value="3">React Native</option>
        </select>

        <br />
        <br />
        <button onClick={conectarSala}>Acessar</button>
      </>
        :
        <>

        {listaMensagem.map((msg, key) => {
          return (
            <div key={key}>
              {msg.nome}: {msg.mensagem}
            </div>
          )
        })}

          <input type="text" name="mensagem" id="name" value={mensagem} placeholder="Mensagem" onChange={(texto) => {setMensagem(texto.target.value)}} />

          <button onClick={enviarMensagem}>Enviar Mensagem</button>

        </>
      }
    </div>
  );
}

export default App;
