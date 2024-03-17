const { Client, NoAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const client = new Client({
    authStrategy: new NoAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Listening to all incoming messages
client.on('message_create', message => {
	console.log(message.body);

    if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});


client.initialize();
