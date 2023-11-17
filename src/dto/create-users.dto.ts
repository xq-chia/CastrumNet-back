export class CreateDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: number;
  hostIds: number[];
}