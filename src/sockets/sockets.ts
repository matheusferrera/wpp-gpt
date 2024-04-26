import { io, whatsappClients, initializeWhatsAppClient } from '../index';

function initializeSocket() {
  io.on("connection", (socket) => {
    // Receive client ID from the frontend
    const clientId = socket.handshake.query.clientId;
  
    // Check existence of received clientId query
    if (clientId && typeof clientId !== "undefined") {
      console.log(`\x1b[33m[socket] => Client connected - ${clientId}\x1b[0m`);
  
      // Join the room corresponding to the client ID
      socket.join(clientId);
  
      // Initialize WhatsApp client if not already initialized
      if (!whatsappClients.has(clientId)) {
        initializeWhatsAppClient(clientId);
      }
    } else {
      console.log("[socket] => A client connected");
    }
  
    // Handle socket disconnection
    socket.on("disconnect", () => {
      if (clientId && typeof clientId !== "undefined") {
        console.log(`[socket] => Client disconnected - ${clientId}`);
      } else {
        console.log("[socket] => A client disconnected");
      }
    });
  });
}

export { initializeSocket };
