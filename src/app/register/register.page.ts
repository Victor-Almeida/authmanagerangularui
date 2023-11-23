import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonInput, IonLabel, IonItem, IonCardHeader, IonCardTitle, IonCardSubtitle, IonNote, IonList } from '@ionic/angular/standalone';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthModel } from '../models/auth.model';
import { OperationResult } from '../models/operationResult.model';
import { RegisterUserModel } from '../models/registerUser.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonCard, 
    IonCardContent, 
    IonInput, 
    IonLabel,
    IonItem,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    CommonModule,
    IonNote,
    IonList,
    ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl('', [ 
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(32),
      Validators.pattern('[a-zA-Z0-9_]*')
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [ 
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)]),
  }, {
    validators: [passwordMatchValidator]
  });

  errorMessages: string[] = [];
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    if (this.storageService.isSessionActive()) {
      this.router.navigate(['/home']);
    }
  }

  registerUser():void  {
    this.errorMessages = [];

    let userInfo: RegisterUserModel = {
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      username: this.registerForm.value.username!
    };

    this.authService.registerUser(userInfo).subscribe({
      next: value => {
        if ((value as AuthModel).bearerToken !== undefined) {
          this.storageService.saveSessionInfo(value as AuthModel);
          this.router.navigate(['/home']);
        } 
      },
      error: err => {
        if((err.error as OperationResult).errorMessages !== undefined) {
          this.errorMessages = (err.error as OperationResult).errorMessages;
        } else {
          this.errorMessages = ['Não foi possível se comunicar com o servidor. Tente novamente mais tarde.']
        }
      }
    });
  }
}

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('passwordConfirmation')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};