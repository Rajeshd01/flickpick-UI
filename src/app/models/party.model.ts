export interface Party{
  id: number;
  roomCode: string;
  hostName: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}
