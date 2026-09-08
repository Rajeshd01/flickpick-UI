import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../models/movie.model';
import { Participant } from '../../models/participant.model';
import { Party } from '../../models/party.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../Service/apiService.service';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-room',
  styleUrl: './room.scss',
  templateUrl: './room.html',
})
export class Room implements OnInit {

  roomCode = '';
  party = signal<Party | null>(null);
  participants = signal<Participant[]>([]);
  movies = signal<Movie[]>([]);
  newMovieTitle = '';
  myName = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode')!;
    this.loadRoomData();
  }

  loadRoomData() {
    this.apiService.getParty(this.roomCode).subscribe({
      next: (party) => this.party.set(party),
      error: () => (this.errorMessage = 'Room not found')
    });

    this.apiService.getParticipants(this.roomCode).subscribe({
      next: (participants) => this.participants.set(participants)
    });

    this.apiService.getMovies(this.roomCode).subscribe({
      next: (movies) => this.movies.set(movies)
    });
  }

  addMovie() {
    if (!this.newMovieTitle.trim() || !this.myName.trim()) {
      this.errorMessage = 'Enter your name and a movie title';
      return;
    }

    this.apiService.addMovie(this.roomCode, this.newMovieTitle, this.myName).subscribe({
      next: () => {
        this.newMovieTitle = '';
        this.errorMessage = '';
        this.loadRoomData();
      },
      error: () => (this.errorMessage = 'Could not add movie')
    });
  }

  joinRoom() {
    if (!this.myName.trim()) {
      this.errorMessage = 'Enter your name to join';
      return;
    }

    this.apiService.joinParty(this.roomCode, this.myName).subscribe({
      next: () => {
        this.errorMessage = '';
        this.loadRoomData();
      },
      error: () => (this.errorMessage = 'Could not join room')
    });
  }

  get canVote(): boolean {
    return this.participants().length >= 2;
  }

  goToVote() {
    this.router.navigate(['/party', this.roomCode, 'vote']);
  }

  copyInviteLink() {
    const link = `${window.location.origin}/party/${this.roomCode}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied!');
  }
}
