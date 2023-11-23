import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonInput, IonLabel, IonItem, IonCardHeader, IonCardTitle, IonCardSubtitle, IonNote, IonList } from '@ionic/angular/standalone';
import { AuthModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticateUserModel } from '../models/authenticateUser.model';
import { OperationResult } from '../models/operationResult.model';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
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
    IonNote,
    CommonModule,
    IonList,
    ReactiveFormsModule],
})
export class LoginPage implements OnInit {  
  public loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [ 
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)])
  });

  public errorMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  authenticateUser(): void {
    this.errorMessages = [];

    let userInfo: AuthenticateUserModel = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.authenticateUser(userInfo).subscribe({
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
          console.debug(err);
          this.errorMessages = ['Não foi possível se comunicar com o servidor. Tente novamente mais tarde.']
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.storageService.isSessionActive()) {
      this.router.navigate(['/home']);
    }
  }
}
