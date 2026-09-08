import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Party} from '../models/party.model';
import {Participant} from '../models/participant.model';
import {Movie} from '../models/movie.model';
import {CastVoteRequest, Vote, VoteResult} from '../models/vote.model';



@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private baseUrl = 'http://localhost:8081/api/parties';

  constructor(private http: HttpClient) {}

  // Party endpoints
  createParty(hostName: string): Observable<Party> {
    return this.http.post<Party>(this.baseUrl, { hostName });
  }

  getParty(roomCode: string): Observable<Party> {
    return this.http.get<Party>(`${this.baseUrl}/${roomCode}`);
  }

  closeParty(roomCode: string): Observable<Party> {
    return this.http.put<Party>(`${this.baseUrl}/${roomCode}/status`, {});
  }

  joinParty(roomCode: string, name: string): Observable<Participant> {
    return this.http.post<Participant>(`${this.baseUrl}/${roomCode}/join`, { name });
  }

  getParticipants(roomCode: string): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.baseUrl}/${roomCode}/participants`);
  }

  // Movie endpoints
  addMovie(roomCode: string, title: string, addedBy: string): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/${roomCode}/movies`, { title, addedBy });
  }

  getMovies(roomCode: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/${roomCode}/movies`);
  }

  // Vote endpoints
  castVote(roomCode: string, request: CastVoteRequest): Observable<Vote[]> {
    return this.http.post<Vote[]>(`${this.baseUrl}/${roomCode}/votes`, request);
  }

  getResult(roomCode: string): Observable<VoteResult> {
    return this.http.get<VoteResult>(`${this.baseUrl}/${roomCode}/result`);
  }
}
