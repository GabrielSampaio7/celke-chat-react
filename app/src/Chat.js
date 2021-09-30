import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, ScrollView, SafeAreaView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import socketIOClient, { Socket } from 'socket.io-client';

import api from './config/configApi'

let socket;

function Chat() {

    const ENDPOINT = "http://192.168.2.169:8080"

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
    }, [])

    useEffect(() => {
        socket.on("receber_mensagem", (dados) => {
            setListaMensagem([...listaMensagem, dados])
        });
    })

    const conectarSala = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post('/validar-acesso', { email }, Headers)
            .then((response) => {

                setNome(response.data.usuario.nome);
                setUsuarioId(response.data.usuario.id);

                setLogado(true);
                socket.emit("sala_conectar", Number(sala));
                listarMensagens();
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

    const enviarMensagem = async () => {

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

        await socket.emit("enviar_mensagem", conteudoMensagem);
        setListaMensagem([...listaMensagem, conteudoMensagem.conteudo]);
        setMensagem("");
    }

    const listarMensagens = async () => {
        await api.get('/listar-mensagens/' + sala)
            .then((response) => {
                setListaMensagem(response.data.mensagens);
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {!logado ?
                    <>
                        {status.type === 'erro' ? <Text>{status.mensagem}</Text> : <Text>{""}</Text>}
                        <Text>Email: </Text>
                        <TextInput
                            style={styles.input}
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Digite seu E-mail"
                            value={email}
                            onChangeText={(texto) => { setEmail(texto) }}
                        />

                        <Text>Sala</Text>

                        {salas.map((detSala) => {
                            return (
                                <View key={detSala.id}>
                                    <RadioButton
                                        value={detSala.id}
                                        status={sala === detSala.id ? 'checked' : 'unchecked'}
                                        onPress={() => setSala(detSala.id)}
                                    />
                                    <Text>{detSala.nome}</Text>
                                </View>
                            )
                        })}

                        <Button onPress={conectarSala}
                            title="Acessar"
                            color="#6fbced"
                        />
                    </>
                    :
                    <>

                        {listaMensagem.map((msg, key) => {
                            return (
                                <View key={key}>
                                    <Text>{msg.usuario.nome}: {msg.mensagem}</Text>
                                </View>
                            )
                        })}

                        <Text>Mensagem</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mensagem..."
                            value={mensagem}
                            onChangeText={(texto) => setMensagem(texto)}
                        />

                        <Button
                            onPress={enviarMensagem}
                            title="Enviar"
                            color="#6fbced"
                        />
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        padding: 25,
        flex: 1,
        backgroundColor: '#fff'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10
    }
})

export default Chat;