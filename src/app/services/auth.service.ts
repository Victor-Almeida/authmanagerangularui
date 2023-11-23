import { Injectable } from '@angular/core';
import { OperationResult } from '../models/operationResult.model';
import { AuthModel } from '../models/auth.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticateUserModel } from '../models/authenticateUser.model';
import { RegisterUserModel } from '../models/registerUser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  authenticateUser(userInfo: AuthenticateUserModel): Observable<AuthModel|OperationResult>
  {
    return this.http.post<AuthModel|OperationResult>(
      environment.authManagerApiUrl + 'api/auth/login', 
      userInfo,
      {
        headers: this.defaultHeader
      });
  } 

  registerUser(userInfo: RegisterUserModel): Observable<AuthModel|OperationResult>
  {
    return this.http.post<AuthModel|OperationResult>(
      environment.authManagerApiUrl + 'api/accounts', 
      userInfo,
      {
        headers: this.defaultHeader
      });
  } 
}
