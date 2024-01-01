import { UserHost } from "src/entity/user_host.entity";

export class EditUserDto {
  userId: number;
  username: string;
  password: any;
  firstName: string;
  lastName: string;
  status: boolean;
  tenantId: number;
}