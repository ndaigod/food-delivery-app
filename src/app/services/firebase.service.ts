import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { map, take, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
 
export interface Order {
  id?: string,
  customer_id?: string,
  shop_id: string,
  name: string,
  status: string,
  price: string,
}

export interface User {
  id: string,
  email: string,
  role: string,
  shop: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private orders: Observable<Order[]>;
  private users: Observable<User[]>;
  private orderCollection: AngularFirestoreCollection<Order>;
  private userCollection: AngularFirestoreCollection<User>;
 
  constructor(private afs: AngularFirestore) {
    this.orderCollection = this.afs.collection<Order>('orders');
    this.userCollection = this.afs.collection<User>('users');
    this.orders = this.orderCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getOrders(id: string, role: string): Observable<Order[]> {
    if (role === 'shop') {
      return this.orders
      .pipe(
        map(orders => orders.filter(order => order.shop_id === id))
      );
    } else if (role === 'customer') {
      return this.orders
      .pipe(
        map(orders => orders.filter(order => order.customer_id === id))
      );
    }
  }
 
  getOrder(id: string): Observable<Order> {
    const currentUser = firebase.auth().currentUser;
    return this.orderCollection.doc<Order>(id).valueChanges().pipe(
      take(1),
      map(order => {
        order.id = id;
        return order
      })
    );
  }
 
  addOrder(order: Order): Promise<DocumentReference> {
    const currentUser = firebase.auth().currentUser;
    order.customer_id = currentUser.uid;
    return this.orderCollection.add(order);
  }
 
  updateOrder(order: Order): Promise<void> {
    return this.orderCollection.doc(order.id).update({ name: order.name, status: order.status, price: order.price});
  }
 
  deleteOrder(id: string): Promise<void> {
    return this.orderCollection.doc(id).delete();
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.id).set(user);
  }

  getUser(): AngularFirestoreDocument<unknown>{
    const currentUser = firebase.auth().currentUser;
    return this.userCollection.doc(currentUser.uid);
  }

  getShops(): Observable<User[]> {
    return this.users
    .pipe(
      map(users => users.filter(user => user.role === 'shop'))
    ); 
  }
}
