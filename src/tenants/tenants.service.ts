import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from "../entity/tenant.entity";
import * as mariadb from "mariadb";

@Injectable()
export class TenantsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: mariadb.Connection
  ) {}

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
