import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService, User } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  shops: Observable<User[]>;
  createForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    ) { }

  ngOnInit() {
    this.initForm();
    this.shops = this.firebaseService.getShops()
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      'name': [
        '',
        [Validators.required]
      ],
      'shop_name': [
        '',
        [Validators.required]
      ]
    });
  }

  create(formValue) {
    const order = {
      price: Math.floor((Math.random() * 100) + 1) + '$',
      status: 'Pending',
      name: formValue.name,
      shop: formValue.shop_name.shop,
      shop_id: formValue.shop_name.id
    }
    this.firebaseService.addOrder(order);
    this.router.navigate(['/orders']);
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
