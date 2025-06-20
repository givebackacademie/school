import { Component, ViewChild, ElementRef } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-videostream',
  templateUrl: './videostream.html',
})
export class Videostream {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private socket = io('http://localhost:3000');
  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;

  async start() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localVideo.nativeElement.srcObject = this.localStream;

    this.createPeerConnection();

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('offer', offer);
  }

  async watch() {
    this.createPeerConnection();

    this.socket.on('offer', async (offer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', answer);
    });

    this.socket.on('candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    this.socket.on('answer', async (answer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on('candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }
}
