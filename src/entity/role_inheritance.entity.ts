export class RoleInheritance {
  roleId: number;
  parentId: number;

  constructor(roleId: number, parentId: number) {
    this.roleId = roleId;
    this.parentId = parentId ? parentId : -1;
  }
}
