export class RoleAssignment {
  userHostId: number;
  roleId: number;

  constructor(userHostId: number, roleId: number) {
    this.userHostId = userHostId;
    this.roleId= roleId;
  }
}

