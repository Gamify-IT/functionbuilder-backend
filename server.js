const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(bodyParser.json());

let rooms = {};
let playerNames = {}; // Stores player names by their socket ID

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomId, playerId }) => {
    playerNames[socket.id] = playerId; // Save player name by socket ID
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], gameState: null, mode: '', roomName: '' };
    }
    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push({ id: playerId, socketId: socket.id });
      socket.join(roomId);
      console.log(`Player ${playerId} joined room ${roomId}`);
      
      // Notify the room that a player joined and send updated player list
      io.to(roomId).emit('playerJoined', rooms[roomId].players);
      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit('startGame', rooms[roomId]);
      }
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].players.findIndex((player) => player.socketId === socket.id);
      if (playerIndex !== -1) {
        rooms[roomId].players.splice(playerIndex, 1);
        io.to(roomId).emit('playerLeft', rooms[roomId].players);
        break;
      }
    }
  });
});

app.post('/createRoom', (req, res) => {
  const { mode, roomName } = req.body; // Capture roomName from the request body
  const roomId = Math.random().toString(36).substr(2, 9); // Generate a random room ID
  rooms[roomId] = { roomName, players: [], gameState: null, mode }; // Store roomName in the room object
  res.json({ roomId, roomName, mode }); // Return roomName to the frontend
  console.log(`Room created with ID: ${roomId}, Name: ${roomName}, and Mode: ${mode}`);
});

app.post('/joinRoom', (req, res) => {
  const { roomId } = req.body;
  if (rooms[roomId]) {
    res.json({ success: true, mode: rooms[roomId].mode });
    console.log(`Player joining room: ${roomId}`);
  } else {
    res.status(404).json({ error: 'Room not found' });
    console.log(`Room not found: ${roomId}`);
  }
});

app.get('/roomState/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.json(rooms[roomId]);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.get('/roomState', (req, res) => {
  // Send all rooms and their states including roomName
  const roomData = Object.keys(rooms).map((roomId) => ({
    gameId: roomId,
    roomName: rooms[roomId].roomName, // Include roomName
    playerCount: rooms[roomId].players.length,
    mode: rooms[roomId].mode,
  }));
  res.json(roomData);
});

app.get('/', (req, res) => {
  res.send('Function Builder Backend is running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
