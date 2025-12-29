import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

class SocketClient {
  private socket: Socket | null = null;
  private connected = false;

  connect(token?: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('❌ WebSocket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Subscribe to agent events
  subscribeToAgent(agentId: string, callbacks: {
    onExecutionStarted?: (data: any) => void;
    onActionStarted?: (data: any) => void;
    onActionCompleted?: (data: any) => void;
    onExecutionCompleted?: (data: any) => void;
  }) {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }

    const events = [
      { name: 'execution:started', callback: callbacks.onExecutionStarted },
      { name: 'execution:action_started', callback: callbacks.onActionStarted },
      { name: 'execution:action_completed', callback: callbacks.onActionCompleted },
      { name: 'execution:completed', callback: callbacks.onExecutionCompleted },
    ];

    events.forEach(({ name, callback }) => {
      if (callback && this.socket) {
        const eventName = `agent:${agentId}:${name}`;
        this.socket.on(eventName, callback);
      }
    });

    return () => {
      events.forEach(({ name, callback }) => {
        if (callback && this.socket) {
          const eventName = `agent:${agentId}:${name}`;
          this.socket.off(eventName, callback);
        }
      });
    };
  }

  isConnected() {
    return this.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketClient = new SocketClient();
