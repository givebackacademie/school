import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarouselConfig, CarouselModule } from 'ng-carousel-cdk';
import { Item, ItemService } from '../../firestore-service.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-carousel',
  imports: [CarouselModule, CommonModule, NgxShimmerLoadingModule, FontAwesomeModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})

//  <p>Current window width: {{ windowWidth }}px</p>
export class Carousel implements OnInit {
  faCoffee = faCoffee;
  faHome = faHome;
  faEnvelope = faEnvelope;
  faUserAlt = faUserAlt;
  faShieldAlt = faShieldAlt;
  faAngleDown = faAngleDown;
  faComments = faComments;
  faUser = faUser;
  faBullhorn = faBullhorn;
  windowWidth: number = 0;
  isBrowser: boolean;

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event): void {
    this.windowWidth = window.innerWidth;

    // Perform actions based on new windowWidth
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private itemService: ItemService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  items1 = <any>[];
  items$ = new BehaviorSubject<Item[]>([]);
  loading = false;
  ngOnInit(): void {
    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
    }

    this.loading = true;
    this.loadItems();
  }

  loadItems() {
    this.itemService.getItems().subscribe((items) => {
      this.items$.next(items);

      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        this.items1.push(element);
        this.loading = false;
      }
    });
  }

  deleteItem(itemId: string) {
    this.itemService.deleteItem(itemId).then(() => {
      this.loadItems();
    });
  }

  config: CarouselConfig = {
    autoplayEnabled: true,
    autoplayDelay: 2000,
    slideWidth: 90,
    transitionDuration: 800,
    items: this.items1,
  };
  config1: CarouselConfig = {
    autoplayEnabled: true,
    autoplayDelay: 2000,
    slideWidth: 40,
    transitionDuration: 800,
    items: this.items1,
  };
}
