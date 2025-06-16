import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnDestroy,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CustomizationOptions } from '@zoom/videosdk-ui-toolkit';

import { ViewportRuler } from '@angular/cdk/scrolling';
import { BackNavbar } from '../back-navbar/back-navbar';
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.html',
  styleUrls: ['./zoom.scss'],
  imports: [CommonModule, BackNavbar],
  // standalone: true
})
export class Zoom implements OnDestroy, OnInit, AfterViewInit {
  isBrowser: boolean;
  sessionContainer: any;
  authEndpoint = 'https://zoom-sooty.vercel.app/api';
  inSession: boolean = false;
  config: CustomizationOptions = {
    videoSDKJWT: '',
    sessionName: 'test',
    userName: 'Angular',
    sessionPasscode: '123',
    features: ['video', 'audio', 'share', 'chat', 'livestream', 'pstn', 'crc', 'ltt', 'recording', 'settings'],
    featuresOptions: {
      feedback: {
        enable: false,
      },
      header: { enable: true },
      phone: {
        enable: false,
      },
      video: {
        enable: true,
      },
      audio: {
        enable: true,
      },
      share: {
        enable: true,
      },
      recording: {
        enable: true,
      },
      preview: {
        enable: false,
        isAllowModifyName: false,
      },
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
  role = 1;

  windowWidth: number = 0;
  windowHeight: number = 0;
  viewportHeight: number = 0;

  @ViewChild('navbar', { static: false }) navbarElement!: ElementRef;
  navbarHeight: number | undefined;

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.navbarHeight = this.navbarElement.nativeElement.offsetHeight;
      console.log('Navbar Height:', this.navbarHeight);

      this.viewportHeight = this.viewportRuler.getViewportSize().height;
      // this.viewportHeight = this.viewportSize.height;
      console.log('Viewport height============:', this.viewportHeight);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    // Perform actions based on new windowWidth
  }
  myStyles = {
    'background-color': 'red',
    ' height': this.windowHeight + 'px',
    'font-weight': 'bold',
  };
  ngOnInit(): void {
    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight; // Adjusted for navbar height
    }
  }
  constructor(
    private el: ElementRef,
    private viewportRuler: ViewportRuler,
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
                // this.el.nativeElement.requestFullscreen();
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
