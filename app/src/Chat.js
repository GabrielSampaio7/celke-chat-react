import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { RadioButton } from 'react-native-paper';
import { Text, TextInput, View, StyleSheet, Button, ScrollView, SafeAreaView } from 'react-native';

import { BotaoBasico, CampoFormulario, ContainerAcesso, ConteudoCampoRadio, TituloAcesso, TituloCampo, TituloOpcaoRadio, TextoBotaoBasico, ContainerChat, FormMensagem, CampoMensagem, BotaoEnviarMsg, TextoBotaoEnviarMsg, ListarMensagem, MsgEnviada, DetMsgEnviada, MsgRecebida, DetMsgRecebida } from './styles/styles';

import api from './config/configApi';

let socket;

function Chat() {

    const ENDPOINT = "http://192.168.2.169:8080";

    const [logado, setLogado] = useState(false);
    const [usuarioId, setUsuarioId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [sala, setSala] = useState("");
    const [salas, setSalas] = useState([]);


    const [mensagem, setMensagem] = useState("");
    const [listaMensagem, setListaMensagem] = useState([]);

    const [status, setStatus] = useState({
        type: "",
        mensagem: ""
    });

    useEffect(() => {
        socket = socketIOClient(ENDPOINT);
        listarSalas();
    }, []);

    useEffect(() => {
        socket.on("receber_mensagem", (dados) => {
            setListaMensagem([dados, ...listaMensagem]);
        });
    });

    const conectarSala = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post("/validar-acesso", { email }, headers)
            .then((response) => {
                //console.log("Acessou a sala " + sala + " com o e-mail " + email);
                setNome(response.data.usuario.nome);
                setUsuarioId(response.data.usuario.id);
                setLogado(true);
                socket.emit("sala_conectar", Number(sala));
                listarMensagens();
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Erro: Tente mais tarde!"
                    });
                }
            });
    }

    const enviarMensagem = async () => {
        //console.log("Mensagem: " + mensagem);
        const conteudoMensagem = {
            sala: Number(sala),
            conteudo: {
                mensagem,
                usuario: {
                    id: usuarioId,
                    nome
                }
            }
        }
        //console.log(conteudoMensagem);
        await socket.emit("enviar_mensagem", conteudoMensagem);
        setListaMensagem([conteudoMensagem.conteudo, ...listaMensagem]);
        setMensagem("");
    }

    const listarMensagens = async () => {
        await api.get("/listar-mensagens-mob/" + sala)
            .then((response) => {
                //setListaMensagem([ ...listaMensagem, response.data.mensagens]);
                setListaMensagem(response.data.mensagens);
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Erro: Tente mais tarde!"
                    });
                }
            })
    }

    const listarSalas = async () => {
        await api.get('/listar-sala')
            .then((response) => {
                setSalas(response.data.salas);
            })
            .catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "erro",
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: "erro",
                        mensagem: "Error: Tente novamente!"
                    });
                }
            })
    }

    return (
        <>
            {!logado ?
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <ContainerAcesso>
                        <TituloAcesso>Meu chat sobre...</TituloAcesso>

                        {status.type === 'erro' ? <Text>{status.mensagem}</Text> : <Text>{""}</Text>}

                        <TituloCampo>E-mail</TituloCampo>
                        <CampoFormulario
                            style={styles.input}
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Coloque o seu e-mail"
                            value={email}
                            onChangeText={(texto) => { setEmail(texto) }}
                        />
                        <TituloCampo>Sala</TituloCampo>
                        {salas.map((detSala) => {
                            return (
                                <ConteudoCampoRadio key={detSala.id}>
                                    <RadioButton
                                        value={detSala.id}
                                        status={sala === detSala.id ? 'checked' : 'unchecked'}
                                        onPress={() => setSala(detSala.id)}
                                    />
                                    <TituloOpcaoRadio>{detSala.nome}</TituloOpcaoRadio>
                                </ConteudoCampoRadio>
                            )
                        })}

                        <BotaoBasico onPress={conectarSala}>
                            <TextoBotaoBasico>Acessar</TextoBotaoBasico>
                        </BotaoBasico>

                    </ContainerAcesso>
                </ScrollView>
                :
                <ContainerChat>
                    <ListarMensagem
                        inverted={true}
                        data={listaMensagem}
                        renderItem={({ item }) => (
                            <>
                                {item.usuario.id === usuarioId ?
                                    <MsgEnviada>
                                        <DetMsgEnviada>
                                            {item.usuario.nome}: {item.mensagem}
                                        </DetMsgEnviada>
                                    </MsgEnviada>
                                    :
                                    <MsgRecebida>
                                        <DetMsgRecebida>
                                            {item.usuario.nome}: {item.mensagem}
                                        </DetMsgRecebida>
                                    </MsgRecebida>
                                }

                            </>
                        )}
                        keyExtractor={(item, index) => index.toString()}

                    />

                    <FormMensagem>
                        <CampoMensagem
                            style={styles.input}
                            placeholder="Mensagem"
                            value={mensagem}
                            onChangeText={(texto) => { setMensagem(texto) }} />

                        <BotaoEnviarMsg onPress={enviarMensagem}>
                            <TextoBotaoEnviarMsg>Enviar</TextoBotaoEnviarMsg>
                        </BotaoEnviarMsg>
                    </FormMensagem>
                </ContainerChat>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        flex: 1,
        backgroundColor: '#fff'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
    }
})

export default Chat;