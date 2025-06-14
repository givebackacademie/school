// import { Injectable } from '@angular/core';
// import { Firestore, collection, getDocs } from '@angular/fire/firestore';

// @Injectable({ providedIn: 'root' })
// export class FirestoreService {
//   constructor(private firestore: Firestore) {}

//   async getData() {
//     const colRef = collection(this.firestore, 'consultants');
//     return await getDocs(colRef);
//   }


//   async getCarousel() {
//     const colRef = collection(this.firestore, 'carousel');
//     return await getDocs(colRef);
//   }
// }


import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, collectionData, where, query, } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

export interface Item {
  id?: string;
  carousel: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private firestore: Firestore = inject(Firestore);

   colRef = collection(this.firestore, 'carousel');
     itemsCollection =  collection( this.firestore, 'carousel');
     itemsCourse =  collection( this.firestore, 'course');
     itemsLivestream =  collection( this.firestore, 'livestreams',);
     itemsListCourse =  collection( this.firestore, 'topics');

     
   getItems(): Observable<Item[]> {
collectionData(this.itemsCollection, { idField: 'id' })
    return collectionData(this.itemsCollection, { idField: 'id' }) as Observable<Item[]>;
  }

  getCourses(): Observable<any[]> {

    return collectionData(this.itemsCourse, { idField: 'id' }) as Observable<any[]>;
  }

  getCoursesList() {
  // return  query(this.itemsCollection, where('courseId','==','T')) ;
    return collectionData(this.itemsListCourse, { idField: 'id' }) as Observable<any[]>;
  }
  getLivestream(): Observable<any[]> {

    return collectionData(this.itemsLivestream, { idField: 'id' }) as Observable<any[]>;
  }

  addItem(item: Item): Promise<any> {
    return addDoc(this.itemsCollection, item);
  }

  updateItem(item: Item): Promise<void> {
    const itemDoc = doc(this.firestore, `items/${item.id}`);
    return updateDoc(itemDoc, { ...item });
  }

  deleteItem(itemId: string): Promise<void> {
     const itemDoc = doc(this.firestore, `items/${itemId}`);
     return deleteDoc(itemDoc);
  }

getqury(){
  return query(this.itemsCollection, where('dir','==','T'))
}

   
}





