export class UserHost {
  userHostId: number;
  userId: number;
  hostId: number;

  constructor(userId: number, hostId: number, userHostId?: number) {
    this.userId = userId;
    this.hostId = hostId;
    this.userHostId = userHostId;
  }
}

