export class Role {
  roleId: number;
  role: string;
  description: string;

  constructor(role: string, description: string, roleId?: number) {
    this.roleId = roleId;
    this.role = role;
    this.description = description;
  }
}