const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // set your API key in environment variable
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', async (msg) => {
    console.log('User says:', msg);

    socket.emit('chat message', { sender: 'user', text: msg });

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // or 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: msg }],
        max_tokens: 150,
        temperature: 0.7,
      });

      const botReply = completion.choices[0].message.content;

      socket.emit('chat message', { sender: 'bot', text: botReply });

    } catch (error) {
      console.error('OpenAI API error:', error);
      socket.emit('chat message', { sender: 'bot', text: "Sorry, I'm having trouble right now." });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
