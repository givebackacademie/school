import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.signalingServerUrl);
  }

  joinRoom(roomId: string, userId: string): void {
    this.socket.emit('join', { roomId, userId });
  }

  onUserJoined(): any {
    return this.socket.on('user-joined', (userId) => userId);
  }

  sendSignal(signal: any, targetUserId: string): void {
    this.socket.emit('signal', { signal, targetUserId });
  }

  onSignalReceived(): any {
    return this.socket.on('signal', (data) => data);
  }
}
