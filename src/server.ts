import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    this.listenSocket();
    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(3000, () => console.log('Server is running on port 3000'));
  }

  listenSocket() {
    this.io.on('connection', (socket) => {
      console.log('User connected =>', socket.id);

      // Entrando em uma sala
      socket.on('joinRoom', (roomName) => {
        // As salas Room1 e Room2
        if (roomName === 'Room1' || roomName === 'Room2') {
          socket.join(roomName); 
          console.log(`${socket.id} joined permanent room: ${roomName}`);
        }
      });

      // Saindo da sala
      socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName); 
        console.log(`${socket.id} left room: ${roomName}`);
      });

      
      socket.on('message', (msg) => {
        console.log('Message received:', msg);
        // Envia a mensagem apenas para a sala específica
        this.io.to(msg.room).emit('message', msg.text);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected =>', socket.id);
      });
    });
  }

  setupRoutes() {
    this.app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });
  }
}

const app = new App();
app.listenServer();
