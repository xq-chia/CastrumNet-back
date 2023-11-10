export class Role {
  roleId: number;
  role: string;
  description: string;

  constructor(roleId: number, role: string, description: string) {
    this.roleId = roleId;
    this.role = role;
    this.description = description;
  }
}