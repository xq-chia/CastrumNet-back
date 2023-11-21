import { UserHost } from "src/entity/user_host.entity";

export class EditUserDto {
  userId: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  status: boolean;
  tenantId: number;
}