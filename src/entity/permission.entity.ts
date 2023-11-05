export class Permission {
  permId: number;
  object: string;
  allow: boolean;

  constructor(permId: number, object: string, allow: boolean) {
    this.permId = permId,
    this.object= object,
    this.allow = allow
  }
}