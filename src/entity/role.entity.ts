export class Role {
  roleId: number;
  role: string;
  description: string;
  parentId: number;

  constructor(roleId: number, role: string, description: string, parentId: number) {
    this.roleId = roleId;
    this.role = role;
    this.description = description;
    this.parentId = parentId ? parentId : -1;
  }
}