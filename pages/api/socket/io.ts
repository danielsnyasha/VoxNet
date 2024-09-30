import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false, // Ensure body parsing is disabled for WebSocket
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false
    });

    // Attach the socket.io instance to res.socket.server
    res.socket.server.io = io;
    
  }
  res.end();
};

export default ioHandler;
