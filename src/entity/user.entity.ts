export class User {
  userId: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: number;

  constructor (userId: number, username: string, password: string, firstName: string, lastName: string, tenantId: number) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.tenantId = tenantId;
  }
}
