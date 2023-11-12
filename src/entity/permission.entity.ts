export class Permission {
  permId: number;
  object: string;
  allow: boolean;
  roleId: number;

  constructor(permId: number, object: string, allow: boolean, roleId: number) {
    this.permId = permId;
    this.object = object;
    this.allow = allow;
    this.roleId = roleId;
  }
}