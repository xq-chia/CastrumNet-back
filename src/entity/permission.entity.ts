export class Permission {
  permId: number;
  object: string;
  allow: boolean;
  roleId: number;

  constructor(permId: number, object: string, allow: number, roleId: number) {
    this.permId = permId;
    this.object = object;
    this.allow = allow === 1 ? true : false;
    this.roleId = roleId;
  }
}