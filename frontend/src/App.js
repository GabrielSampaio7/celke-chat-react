import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

import {
  Container,
  Conteudo,
  Header,
  Form,
  Campo,
  Label,
  Input,
  Select,
  BtnAcessar,
  HeaderChat,
  ImgUsuario,
  NomeUsuario,
  ChatBox,
  ConteudoChat,
  MsgEnviada,
  DetMsgEnviada,
  TextoMsgEnviado,
  MsgRecebida,
  DetMsgRecebida,
  TextoMsgRecebido,
  EnviarMsg,
  CampoMsg,
  BtnEnviarMsg
} from './styles/styles';

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
    console.log("Mensagem" + mensagem);

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
    <Container>
      {!logado ?
        <Conteudo>
          <Header>Chat</Header>
          <Form>
            <Campo>
              <Label>Nome: </Label>
              <Input type="text" placeholder="Nome" name="nome" value={nome} onChange={(text) => { setNome(text.target.value) }} />
            </Campo>
            <Campo>
              <Label>Sala: </Label>
              <Select name="sala" value={sala} onChange={texto => setSala(texto.target.value)}>
                <option value="">Selecione</option>
                <option value="1">Node.js</option>
                <option value="2">React</option>
                <option value="3">React Native</option>
              </Select>
            </Campo>
            <BtnAcessar onClick={conectarSala}>Acessar</BtnAcessar>
          </Form>
        </Conteudo>
        :
        <ConteudoChat>
          <HeaderChat>
            <ImgUsuario src="" alt={nome} />
            <NomeUsuario>{nome}</NomeUsuario>
          </HeaderChat>
          <ChatBox>
            {listaMensagem.map((msg, key) => {
              return (
                <div key={key}>
                  {nome === msg.nome ?

                    <MsgEnviada>
                      <DetMsgEnviada>
                        <TextoMsgEnviado>
                          {msg.nome} : {msg.mensagem}
                        </TextoMsgEnviado>
                      </DetMsgEnviada>
                    </MsgEnviada>
                    :
                    <MsgRecebida>
                      <DetMsgRecebida>
                        <TextoMsgRecebido>
                          {msg.nome} : {msg.mensagem}
                        </TextoMsgRecebido>
                      </DetMsgRecebida>
                    </MsgRecebida>
                  }
                </div>
              )
            })}
          </ChatBox>
          <EnviarMsg>
            <CampoMsg type="text" name="mensagem" id="name" value={mensagem} placeholder="Mensagem" onChange={(texto) => { setMensagem(texto.target.value) }} />

            <BtnEnviarMsg onClick={enviarMensagem}>Enviar</BtnEnviarMsg>
          </EnviarMsg>

        </ConteudoChat>
      }
    </Container>
  );
}

export default App;
