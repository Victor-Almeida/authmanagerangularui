import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  public username = '';

  constructor(
    private router: Router,
    private storageService: StorageService) { }

  ngOnInit() {
    let sessionInfo = this.storageService.getSessionInfo();

    if (sessionInfo !== undefined) {
      this.username = sessionInfo.username;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.storageService.clearSessionInfo();
    this.router.navigate(['/login'])
  }
}
