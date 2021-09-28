const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

app.get('/', function(req, res){
    res.send('Hello world')
});

const server = app.listen(3004, () => {
    console.log('Server started successfully - Port 3004');
});

io = socket(server, {cors: {origin: "*"}});

io.on("Connection", (socket) => {
    console.log(socket.id);

    socket.on("sala_conectar", (dados) => {
        socket.join(data);
        console.log("Sala selecionada:" + data)
    })

    socket.on("enviar_mensagem", (dados) => {
        console.log(dados);
        socket.to(dados.sala).emit("receber_mensagem", dados.conteudo);
    })
})