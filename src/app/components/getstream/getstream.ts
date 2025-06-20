// src/app/components/stream/stream.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stream',
  template: `
    <div class="stream-container">
      <video #videoElement autoplay playsinline muted [attr.id]="streamId"></video>
    </div>
  `,
  styles: [
    `
      .stream-container {
        position: relative;
        width: 300px;
        height: 200px;
        background: #000;
        margin: 10px;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `,
  ],
})
export class Getstream implements OnInit {
  @Input() stream!: MediaStream;
  @Input() streamId!: string;

  ngOnInit() {
    const video = document.getElementById(this.streamId) as HTMLVideoElement;
    if (video) {
      video.srcObject = this.stream;
    }
  }
}
