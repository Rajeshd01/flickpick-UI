import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../Service/apiService.service';
import { Movie } from '../../models/movie.model';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-vote',
  styleUrl: './vote.scss',
  templateUrl: './vote.html',
})
export class Vote implements OnInit {

  roomCode = '';
  movies = signal<Movie[]>([]);
  voterName = '';
  errorMessage = '';

  // holds the movieId selected for rank 1, 2, 3
  rankings: (number | null)[] = [null, null, null];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode')!;
    this.apiService.getMovies(this.roomCode).subscribe({
      next: (movies) => this.movies.set(movies)
    });
  }

  submitVote() {
    if (!this.voterName.trim()) {
      this.errorMessage = 'Enter your name';
      return;
    }

    const rankedMoviesIds = this.rankings.filter((id): id is number => id !== null);

    if (rankedMoviesIds.length === 0) {
      this.errorMessage = 'Pick at least one movie';
      return;
    }

    // prevent picking the same movie twice across ranks
    const uniqueCheck = new Set(rankedMoviesIds);
    if (uniqueCheck.size !== rankedMoviesIds.length) {
      this.errorMessage = 'Each rank must be a different movie';
      return;
    }

    this.apiService.castVote(this.roomCode, {
      voterName: this.voterName,
      rankedMoviesIds
    }).subscribe({
      next: () => {
        this.router.navigate(['/party', this.roomCode, 'results']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not submit vote';
      }
    });
  }
}
