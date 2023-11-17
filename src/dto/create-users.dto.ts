export class CreateDto {
  userId: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: number;
  hostIds: number[];
}