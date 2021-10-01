import styled from "styled-components";

export const ContainerAcesso = styled.SafeAreaView`
    flex: 1;
    padding: 20px;
    justify-content: center;
    background-color: #f9f9f9;
`;

export const TituloAcesso = styled.Text`
    font-size: 22px;
    color: #6fbced;
    text-align: center;
`;

export const TituloCampo = styled.Text`
    padding-top: 1px;
    color: #111;
    font-size: 18px;
    margin-bottom: 5px;
`;

export const CampoFormulario = styled.TextInput`
    background-color: #fff;
    margin-bottom: 15px;
    color: #222;
    font-size: 18px;
    padding: 10px;
    border-radius: 5px;
    border-color: #6fbced;
    border-width: 1px;
`;

export const ConteudoCampoRadio = styled.View`
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
`;

export const TituloOpcaoRadio = styled.Text`
    padding-top: 7px;
    font-size: 16px;
`;

export const BotaoBasico = styled.TouchableOpacity`
    margin: 2px;
    background-color: #6fbced;
    border: 1px solid #6fbced;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
`;

export const TextoBotaoBasico = styled.Text`
    color: #fff;
    font-size: 18px;
    padding: 4px;
`;

export const ContainerChat = styled.View`
    flex: 1;
    background-color: #fff;
`;

export const FormMensagem = styled.View`
    flex-direction: row;
    width: 100%;
    height: 50px;
    background-color: #fff;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;
`;

export const CampoMensagem = styled.TextInput`
    flex: 1;
    height: 40px;
    border-color: #6fbced;
    border-width: 1px;
    padding: 5px;
`;

export const BotaoEnviarMsg = styled.TouchableOpacity`
    width: 60px;
    height: 41px;
    background-color: #6fbced;
    padding: 2px;
    justify-content: center;
`;

export const TextoBotaoEnviarMsg = styled.Text`
    margin-left: 10px;
    color: #fff;
`;

export const ListarMensagem = styled.FlatList`
    flex: 1;
`;

export const MsgEnviada = styled.View`
    align-self: flex-end;
    margin-right: 10px;
    margin-bottom: 6px;
    margin-top: 6px;
`;

export const DetMsgEnviada = styled.Text`
    border-radius: 10px;
    width: 230px;
    background-color: #6fbced;
    color:  #fff;
    padding: 8px 10px;
    overflow: hidden;
`;

export const MsgRecebida = styled.View`
    margin-left: 10px;
    margin-bottom: 6px;
    margin-top: 6px;
`;

export const DetMsgRecebida = styled.Text`
    border-radius: 10px;
    width: 230px;
    background-color: #58b666;
    color: #fff;
    padding: 8px 10px;
    overflow: hidden;
`;

export const Exemplo = styled.Text`

`;