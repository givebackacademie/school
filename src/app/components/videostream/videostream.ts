import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-video-stream',
  templateUrl: './videostream.html',
})
export class VideoStream implements AfterViewInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private socket = io('https://stream-swart-sigma.vercel.app');

  async ngAfterViewInit() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = stream;

    // Send frames every 100ms
    setInterval(() => {
      const video = this.videoRef.nativeElement;
      const canvas = this.canvasRef.nativeElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        this.socket.emit('video-frame', dataUrl);
      }
    }, 100); // ~10fps
  }
}
