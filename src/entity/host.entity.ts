export class Host {
    hostId: number;
    host: string;
    ipAddress: string;

  constructor(host: string, ipAddress: string, hostId?: number) {
    this.hostId = hostId;
    this.host = host;
    this.ipAddress = ipAddress;
  }
}
