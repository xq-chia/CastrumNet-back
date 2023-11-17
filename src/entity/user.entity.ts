export class User {
  userId: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  status: boolean;
  tenantId: number;

  constructor (username: string, password: string, firstName: string, lastName: string, status: boolean, tenantId: number, userId?: number) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
    this.tenantId = tenantId;
  }
}
