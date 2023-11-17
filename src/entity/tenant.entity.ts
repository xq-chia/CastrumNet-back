export class Tenant {
  tenantId: number;
  role: string;

  constructor(role: string, tenantId?: number) {
    this.tenantId = tenantId;
    this.role = role;
  }
}
