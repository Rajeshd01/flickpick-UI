import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../Service/apiService.service';
import { Movie } from '../../models/movie.model';
import { VoteResult } from '../../models/vote.model';

interface ScoreRow {
  movie: Movie;
  score: number;
}

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-results',
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results implements OnInit {

  roomCode = '';
  winner = signal<Movie | null>(null);
  scoreRows = signal<ScoreRow[]>([]);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode')!;
    this.loadResults();
  }

  loadResults() {
    this.apiService.getMovies(this.roomCode).subscribe({
      next: (movies) => {
        this.apiService.getResult(this.roomCode).subscribe({
          next: (result: VoteResult) => {
            const rows: ScoreRow[] = movies
              .map((movie) => ({
                movie,
                score: result.scores[movie.id] ?? 0
              }))
              .sort((a, b) => b.score - a.score);

            this.scoreRows.set(rows);

            const winnerMovie = movies.find((m) => m.id === result.winnerMovieId) ?? null;
            this.winner.set(winnerMovie);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.message || 'No votes have been cast yet');
          }
        });
      }
    });
  }

  closeVoting() {
    this.apiService.closeParty(this.roomCode).subscribe({
      next: () => this.loadResults()
    });
  }

  backToRoom() {
    this.router.navigate(['/party', this.roomCode]);
  }
}
