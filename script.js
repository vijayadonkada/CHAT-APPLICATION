const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = input.value.trim();
  if (!msg) return;

  // Send message to server
  socket.emit('chat message', msg);

  // Clear input box
  input.value = '';
});

socket.on('chat message', (msgObj) => {
  const item = document.createElement('li');
  item.classList.add('message');

  if (msgObj.sender === 'user') {
    item.classList.add('user');
  } else if (msgObj.sender === 'bot') {
    item.classList.add('bot');
  }

  item.textContent = msgObj.text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
