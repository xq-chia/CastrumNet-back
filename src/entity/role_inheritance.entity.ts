export class RoleInheritance {
  roleId: number;
  parentId: number;
  inheritanceId: number;

  constructor(roleId: number, parentId: number, inheritanceId?: number) {
    this.inheritanceId = inheritanceId;
    this.roleId = roleId;
    this.parentId = parentId ? parentId : -1;
  }
}
