export class User {
  userId: number;
  username: string;
  password: any;
  firstName: string;
  lastName: string;
  status: boolean;
  tenantId: number;
  loginAttempt: number;

  constructor (username: string, password: any, firstName: string, lastName: string, status: boolean, tenantId: number, userId?: number, loginAttempt?: number) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
    this.tenantId = tenantId;
    this.loginAttempt = loginAttempt;
  }
}
