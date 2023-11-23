import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private BEARER_TOKEN_KEY = 'bearerToken';
  private USER_ID_KEY = 'userId';
  private USERNAME_KEY = 'username';

  constructor() { }

  clearSessionInfo(): void {
    window.sessionStorage.clear();
  }

  getSessionInfo(): AuthModel | undefined {
    let bearerToken = window.sessionStorage.getItem(this.BEARER_TOKEN_KEY);
    let userId = window.sessionStorage.getItem(this.USER_ID_KEY);
    let username = window.sessionStorage.getItem(this.USERNAME_KEY);

    if (bearerToken !== null && userId !== null && username !== null) {
      return {
        bearerToken: bearerToken!,
        userId: userId!,
        username: username!
      }
    } 

    return undefined;
  }

  isSessionActive(): boolean {
    return this.getSessionInfo() !== undefined;
  }

  saveSessionInfo(sessionInfo: AuthModel): void {
    window.sessionStorage.setItem(this.BEARER_TOKEN_KEY, sessionInfo.bearerToken);
    window.sessionStorage.setItem(this.USER_ID_KEY, sessionInfo.userId);
    window.sessionStorage.setItem(this.USERNAME_KEY, sessionInfo.username);
  }
}
