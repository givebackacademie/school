import { Component } from '@angular/core';
import { CarouselAlignMode, CarouselConfig, CarouselModule, CarouselWidthMode } from 'ng-carousel-cdk';
import { BehaviorSubject } from 'rxjs';
import { ItemService } from '../../firestore-service.service';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BackNavbar } from '../back-navbar/back-navbar';

@Component({
  selector: 'app-livestream',
  imports: [CarouselModule, NgxShimmerLoadingModule, CommonModule, RouterLink, BackNavbar],
  templateUrl: './livestream.html',
  styleUrl: './livestream.scss',
  standalone: true,
})
export class Livestream {
  constructor(private itemService: ItemService) {}
  items1 = <any>[];
  items$ = new BehaviorSubject<any[]>([]);
  loading = false;
  ngOnInit(): void {
    this.loading = true;
    this.loadItems();
  }

  loadItems() {
    this.itemService.getLivestream().subscribe((items) => {
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
    autoplayEnabled: false,
    autoplayDelay: 2000,
    slideWidth: 280,
    widthMode: CarouselWidthMode.PX,
    alignMode: CarouselAlignMode.LEFT,
    // recalculateDebounce : 300,
    transitionDuration: 800,
    items: this.items1,
  };
}
