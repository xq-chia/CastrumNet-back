import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from "../entity/tenant.entity";
import { Connection } from "mariadb";

@Injectable()
export class TenantsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection
  ) {}

  async findAll(): Promise<Tenant[]> {
    let sql: string;
    let tenants: Tenant[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM tenant';

    sqlResult = await this.connection.query(sql);
    for (const row of sqlResult) {
      let tenant: Tenant;

      tenant = new Tenant(row.role, row.tenantId);

      tenants.push(tenant);
    }

    return tenants;
  }

  async findOneById(tenantId: number): Promise<Tenant | undefined> {
    let sql: string;
    let sqlResult: any;
    let tenant: Tenant;

    sql = "SELECT * FROM tenant WHERE tenantId = ?";

    sqlResult = (await this.connection.query(sql, [tenantId]))[0];
    tenant = new Tenant(sqlResult.role, sqlResult.tenantId);

    return tenant;
  }
}
