export class Role {
  roleId: number;
  role: string;
  parentId: number;

  constructor(roleId: number, role: string, parentId: number) {
    this.roleId = roleId;
    this.role = role;
    this.parentId = parentId;
  }
}