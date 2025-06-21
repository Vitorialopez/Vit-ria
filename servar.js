const express = require('express');
const fetch = require('node-fetch');
const wppconnect = require('wppconnect');

const app = express();
app.use(express.json());

// Inicializando o WPPConnect e conectando ao WhatsApp
wppconnect.create().then((client) => {
  client.onMessage(async (message) => {
    console.log('Mensagem recebida:', message.body);

    // Enviar a mensagem recebida para o Webhook
    const aiResponse = await fetch('http://localhost:3000/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.body }),
    });

    const data = await aiResponse.json();
    const responseText = data.response;

    // Enviar resposta de volta para o WhatsApp
    client.sendText(message.from, responseText);
  });
}).catch(error => {
  console.error('Erro ao conectar com WhatsApp:', error);
});

// Endpoint para o Webhook
app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  console.log('Recebido no Webhook:', message);

  // Simulando uma resposta da IA
  const aiResponse = {
    response: `Você disse: "${message}", como posso ajudar?`,
  };

  res.status(200).json(aiResponse); // Enviar resposta de volta para o WhatsApp
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor de Webhook rodando na porta 3000');
});
