import { Component, inject, input, OnInit } from '@angular/core';

import { ItemService } from '../../firestore-service.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, collectionData, Firestore, getFirestore, query, where } from '@angular/fire/firestore';
import { first, Observable } from 'rxjs';

import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { BackNavbar } from '../back-navbar/back-navbar';
import { Secondfooter } from '../secondfooter/secondfooter';

@Component({
  selector: 'app-course-list',
  imports: [RouterLink, BackNavbar, Secondfooter],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private router: Router,
  ) {}
  name: string | null = null;
  id = input();
  course$ = new BehaviorSubject<any[]>([]);
  course1$ = <any>[];
  loading = false;

  activeTab: string = 'home';

  setActive(tab: string) {
    this.activeTab = tab;
  }
  ngOnInit(): void {
    console.log(this.id());
    this.loading = true;
    this.loadItems();
    this.getUrl();
  }
  private firestore: Firestore = inject(Firestore);
  itemsListCourse = collection(this.firestore, 'topics');

  loadItems() {
    this.name = this.route.snapshot.paramMap.get('id');
    this.itemService.getCourses().subscribe((items) => {
      items.forEach((doc) => {
        if (doc.id == this.name) {
          console.log(doc);
          this.course1$.push(doc);
        }
      });
      // const things =
      // console.log(things);
      //   items.map((n) =>{
      //     if(n.id == this.id())

      //   this.course1$.push(n);
      //     // n.id
      //   } )

      this.loading = false;
      //  for (let index = 0; index < items.length; index++) {
      //   const element = items[index];
      //   console.log(element);
      //   this.course1$.push(element)
      //   this.loading = false;

      //  }
    });
  }

  getUrl() {
    console.log(this.name);
    const refq = query(this.itemsListCourse, where('courseId', '==', this.name));
    const res$ = collectionData(refq);
    res$.subscribe((items) => this.course$.next(items));

    //  collectionData(this.itemsCourse, { idField: 'id' }) as Observable<any[]>;
    //  console.log(this.itemsCourse);
    //  const titleq = query(this.itemsCourse, where(this.itemsCourse.id,'==',this.id()))
    const res1$ = collectionData(refq);

    res1$.subscribe((itemss) => {
      this.course$.next(itemss);
    });
  }
}
