export interface Vote{
  id: number;
  partyId: number;
  voterName: string;
  movieId: number;
  rank: number;
}

export interface CastVoteRequest {
  voterName: string;
  rankedMoviesIds: number[];
}

export interface VoteResult {
  scores: { [movieId: string]: number };
  winnerMovieId: number;
}
