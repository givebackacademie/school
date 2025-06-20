// src/app/services/stream.service.ts
import { Injectable } from '@angular/core';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private socket: any;
  private peers: { [key: string]: any } = {};
  public onStream = new Subject<{ id: string; stream: MediaStream }>();

  constructor() {
    this.socket = io('http://localhost:3000'); // Replace with your signaling server URL
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('signal', (data: { from: string; signal: any }) => {
      if (this.peers[data.from]) {
        this.peers[data.from].signal(data.signal);
      }
    });

    this.socket.on('user-disconnected', (userId: string) => {
      if (this.peers[userId]) {
        this.peers[userId].destroy();
        delete this.peers[userId];
      }
    });
  }

  public initStream(isInitiator: boolean, stream?: MediaStream): Observable<MediaStream> {
    return new Observable((subscriber) => {
      this.socket.emit('join-room', 'ROOM_ID');

      this.socket.on('users', (users: string[]) => {
        users.forEach((userId) => {
          if (userId === this.socket.id || this.peers[userId]) return;

          const peer = new SimplePeer({
            initiator: isInitiator,
            stream: stream,
            trickle: false,
          });

          peer.on('signal', (signal: any) => {
            this.socket.emit('signal', { to: userId, from: this.socket.id, signal });
          });

          peer.on('stream', (remoteStream: MediaStream) => {
            this.onStream.next({ id: userId, stream: remoteStream });
            subscriber.next(remoteStream);
          });

          this.peers[userId] = peer;
        });
      });
    });
  }

  public async getLocalStream(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (err) {
      console.error('Error accessing media devices:', err);
      throw err;
    }
  }
}
