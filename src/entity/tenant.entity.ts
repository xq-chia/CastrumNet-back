export class Tenant {
  tenantId: number;
  role: string;

  constructor(tenantId: number, role: string) {
    this.tenantId = tenantId;
    this.role = role;
  }
}
