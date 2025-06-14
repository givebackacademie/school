import { Component, input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ItemService } from '../../firestore-service.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-course',
  imports: [RouterLink],
  templateUrl: './course.html',
  styleUrl: './course.scss',
})
export class CourseComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    private router: Router,
  ) {}

  items1 = <any>[];
  course$ = new BehaviorSubject<any[]>([]);
  loading = false;
  ngOnInit(): void {
    this.loading = true;
    this.loadItems();
  }

  loadItems() {
    this.itemService.getCourses().subscribe((items) => {
      this.course$.next(items);
      this.loading = false;
      //  for (let index = 0; index < items.length; index++) {
      //   const element = items[index];
      //   this.items1.push(element)
      //   this.loading = false;

      //  }
    });
  }
}
