import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-video-chat',
  templateUrl: './getstream.html',
  styleUrls: ['./getstream.scss'],
})
export class Getstream implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  socket = io('https://stream-swart-sigma.vercel.app');
  peerConnection: RTCPeerConnection | null = null;

  async ngOnInit() {
    await this.startLocalStream();

    this.socket.on('signal', async (data) => {
      if (!this.peerConnection) this.createPeerConnection();

      if (data.offer) {
        if (this.peerConnection) {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        }
        const answer = await this.peerConnection?.createAnswer();
        await this.peerConnection?.setLocalDescription(answer);
        this.socket.emit('signal', { answer });
      }

      if (data.answer) {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data.iceCandidate) {
        await this.peerConnection?.addIceCandidate(data.iceCandidate);
      }
    });
  }

  async startLocalStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localVideo.nativeElement.srcObject = stream;

    this.createPeerConnection();
    stream.getTracks().forEach((track) => this.peerConnection!.addTrack(track, stream));
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection();

    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.remoteVideo.nativeElement.srcObject = remoteStream;
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('signal', { iceCandidate: event.candidate });
      }
    };
  }

  async call() {
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    this.socket.emit('signal', { offer });
  }
}
