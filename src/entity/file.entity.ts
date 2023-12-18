export class File {
  fileId: number;
  path: string;
  roleId: number;

  constructor(path: string, roleId: number, fileId?: number) {
    this.fileId = fileId;
    this.path = path;
    this.roleId = roleId;
  }
}
