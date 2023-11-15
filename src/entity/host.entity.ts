export class Host {
    hostId: number;
    host: string;
    ipAddress: string;

  constructor(hostId: number, host: string, ipAddress: string) {
    this.hostId = hostId;
    this.host = host;
    this.ipAddress = ipAddress;
  }
}
