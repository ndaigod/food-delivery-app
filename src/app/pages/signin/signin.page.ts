import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      'email': [
        '',
        [Validators.required, Validators.email]
      ],
      'password': [
        '',
        [Validators.required]
      ]
    });
  }

  signIn(credentials) {
    this.authService.signIn(credentials)
    .then(user => {
      this.router.navigate(['/orders']);
    })
    .catch(err => {
      console.log('error: ', err)
    })
  }

}
