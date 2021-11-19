import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService, Order, User } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  user: User = {
    id: '',
    email: '',
    shop: '',
    role: ''
  };
  orders: Order[] = [];
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService,
    ) { }

  ngOnInit() {
    this.firebaseService.getUser().get().toPromise().then(doc => {
      if (doc.exists) {
          this.user = {
            id: doc.data().id,
            email: doc.data().email,
            role: doc.data().role,
            shop: doc.data().shop
          } 
          this.firebaseService.getOrders(this.user.id, this.user.role).subscribe(res => {
            this.orders = res;
          });
      }
    }).catch(error => {
        console.log(error);
    });
  }

  ionViewWillEnter() {
    if (this.user.id) {
      this.firebaseService.getOrders(this.user.id, this.user.role).subscribe(res => {
        this.orders = res;
      });
    }
  }

  signOut() {
    this.authService.signOut()
    .then(user => {
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.log('error: ', err)
    })
  }

}
