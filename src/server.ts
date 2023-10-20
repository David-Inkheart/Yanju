import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import path from 'path';
import router from './routes/index';
import { jwtErrorHandler } from './middleWares/error-handlers';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const Port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// Create a route for WebSocket/chat
app.get('/chat', (req, res) => {
  const chatPage = path.join(__dirname, '../public/index.html');
  res.sendFile(chatPage);
});

// ... REST API routes will go here
app.use('/', router);

// Not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Error Handling to catch any unhandled error during req processing
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError') {
    return jwtErrorHandler(err, req, res, next);
  }
  if (err.name === 'TokenExpiredError') {
    return jwtErrorHandler(err, req, res, next);
  }
  console.error(err.stack);
  return res.status(500).json({
    success: false,
    message: 'There was a problem processing your request, please try again later',
    // error: err.message,
  });
});

// Socket.io
io.on('connection', (socket) => {
  console.log(`User-${socket.id} connected`);
  socket.broadcast.emit('user joined', `User-${socket.id} joined`);

  socket.on('disconnect', () => {
    console.log(`User-${socket.id} disconnected`);
    socket.broadcast.emit('user left', `User-${socket.id} left`);
  });

  socket.on('chat message', (msg) => {
    console.log(`User-${socket.id} says: ${msg}`);
    const message = `User-${socket.id}: ${msg}`;
    io.emit('chat message', message);
  });
});

server.listen(Port, () => {
  // eslint-disable-next-line no-console
  console.log(`REST API server is running on http://localhost:${Port}`);
});

export default app;
