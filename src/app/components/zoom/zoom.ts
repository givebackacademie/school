import { Component, Inject, NgZone, PLATFORM_ID, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CustomizationOptions } from '@zoom/videosdk-ui-toolkit';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.html',
  styleUrls: ['./zoom.scss'],
  imports: [Navbar],
  // standalone: true
})
export class Zoom implements OnDestroy {
  isBrowser: boolean;
  sessionContainer: any;
  authEndpoint = 'http://localhost:4000';
  inSession: boolean = false;
  config: CustomizationOptions = {
    videoSDKJWT: '',
    sessionName: 'test',
    userName: 'Angular',
    sessionPasscode: '123',
    features: [
      'preview',
      'video',
      'audio',
      'share',
      'chat',
      'livestream',
      'users',
      'pstn',
      'crc',
      'ltt',
      'recording',
      'settings',
      'feedback',
    ],
    featuresOptions: {
      virtualBackground: {
        enable: true,
        virtualBackgrounds: [
          {
            url: 'https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop',
          },
        ],
      },
    },
  };
  role = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,

    public httpClient: HttpClient,
    @Inject(DOCUMENT) document: Document,
    private ngZone: NgZone,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  async ngOnDestroy() {
    if (this.isBrowser) {
      const uitoolkit = await import('@zoom/videosdk-ui-toolkit');

      uitoolkit.default.destroy();
      this.sessionClosed();

      window.location.reload();
    }
  }

  async getVideoSDKJWT() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isBrowser) {
        const uitoolkit = await import('@zoom/videosdk-ui-toolkit');
        this.sessionContainer = document.getElementById('sessionContainer');

        this.inSession = true;

        this.httpClient
          .post(this.authEndpoint, {
            sessionName: this.config.sessionName,
            role: this.role,
            videoWebRtcMode: 1,
          })
          .subscribe((data: any) => {
            if (data.signature) {
              console.log(data.signature);
              this.config.videoSDKJWT = data.signature;
              this.ngZone.runOutsideAngular(() => {
                uitoolkit.default.joinSession(this.sessionContainer, this.config);
                uitoolkit.default.onSessionClosed(this.sessionClosed);
                uitoolkit.default.onSessionDestroyed(this.sessionDestroyed);
              });
            } else {
              console.log(data);
            }
          });
      }
    }
  }

  sessionClosed = () => {
    console.log('session closed');
    this.inSession = false;
  };
  sessionDestroyed = async () => {
    if (this.isBrowser) {
      const uitoolkit = await import('@zoom/videosdk-ui-toolkit');
      console.log('session destroyed');
      uitoolkit.default.destroy();
    }
  };
}
