import { Component } from '@angular/core';
import {FormBuilder, FormsModule} from '@angular/forms';
import {ApiServiceService} from '../../Service/apiService.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  standalone: true,
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  hostName='';
  errorMessage ='';

  constructor(private apiService: ApiServiceService, private router: Router) { }

  createParty() {
    if (!this.hostName.trim()) {
      this.errorMessage = 'Please enter your name';
      return;
    }

    this.apiService.createParty(this.hostName).subscribe({
      next: (party) => {
        this.router.navigate(['/party', party.roomCode]);
      },
      error: (err) => {
        this.errorMessage = 'Something went wrong. Please try again.';
        console.error(err);
      }
    });
  }
}
