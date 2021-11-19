import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      'email': [
        '',
        [Validators.required, Validators.email]
      ],
      'password': [
        '',
        [Validators.required]
      ],
      'role': [
        '',
        [Validators.required]
      ],
      'shop': [
        '',
        [Validators.required]
      ]
    });

    const shopNameControl = this.signUpForm.get('shop');

    this.signUpForm.get('role').valueChanges
    .subscribe(role => {
      if (role === 'shop') {
        shopNameControl.setValidators([Validators.required]);
      } else {
        shopNameControl.setValidators(null);
      }
      shopNameControl.updateValueAndValidity();
    });
  }

  signUp(credentials) {
    let userInfo = {
      email: this.signUpForm.value.email,
      role: this.signUpForm.value.role,
      shop: this.signUpForm.value.shop
    }
    this.authService.signUp(credentials, userInfo)
    .then(user => {
      this.router.navigate(['/orders']);
    })
    .catch(err => {
      console.log('error: ', err)
    })
  }
}