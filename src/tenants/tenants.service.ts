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

      tenant = new Tenant(row.tenantId, row.role);

      tenants.push(tenant);
    }

    return tenants;
  }

  async findOneById(id: number): Promise<Tenant | undefined> {
    let sql: string;
    let sqlResult: any;
    let tenant: Tenant;

    sql = "SELECT * FROM tenant WHERE tenantId = ?";

    sqlResult = (await this.connection.query(sql, [id]))[0];
    tenant = new Tenant(sqlResult.tenantId, sqlResult.role);

    return tenant;
  }
}
