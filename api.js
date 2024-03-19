// Setup environment variables
require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json());

const clients = require('./clients');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Hello World! POST')
  })

app.get('/client/messages', async (req, res) => {
    const chats = await clients.client.getChats();
    res.send(chats[0]);
})

app.post('/messages', (req, res) => {
    console.log(req.body);
    const message = req.body["message"];
    const from = req.body["from"];
    clients.client.sendMessage(from, message);
    res.send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})