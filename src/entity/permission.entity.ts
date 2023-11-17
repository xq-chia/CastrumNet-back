export class Permission {
  permId: number;
  object: string;
  allow: boolean;
  roleId: number;

  constructor(object: string, allow: boolean, roleId: number, permId?: number) {
    this.permId = permId;
    this.object = object;
    this.allow = allow;
    this.roleId = roleId;
  }
}