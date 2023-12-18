import { Inject, Injectable } from '@nestjs/common';
import { Permission } from 'src/entity/permission.entity';
import { Connection } from 'mariadb';
import * as parse from 'bash-parser'
import * as traverse from 'bash-ast-traverser';
import { PermissionService } from 'src/permission/permission.service';
import { Role } from 'src/entity/role.entity';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';
import { RoleService } from 'src/role/role.service';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { File } from 'src/entity/file.entity';
import { FileService } from 'src/file/file.service';

@Injectable()
export class RbacService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection,
    private permissisonService: PermissionService,
    private roleInheritanceService: RoleInheritanceService,
    private roleService: RoleService,
    private roleAssignmentSrv: RoleAssignmentService,
    private fileService: FileService
  ) {}

  async getPermissionsByRoleId(roleId: number): Promise<Permission[]> {
    let roleInheritances: RoleInheritance[];
    let permissions: Permission[] = [];

    roleInheritances = await this.roleInheritanceService.findByRoleId(roleId);

    if (roleInheritances.length) {
      for (const roleInheritance of roleInheritances) {
        let parent: Role;

        parent = await this.roleService.findOneByRoleId(roleInheritance.parentId);
        permissions = permissions.concat(...await this.getPermissionsByRoleId(parent.roleId));
      }
      permissions = permissions.concat(await this.permissisonService.findAllByRoleId(roleId));
    } else {
      return await this.permissisonService.findAllByRoleId(roleId); 
    }
    return permissions;
  }

  async getFilesByRoleId(roleId: number): Promise<File[]> {
    let roleInheritances: RoleInheritance[];
    let files: File[] = [];

    roleInheritances = await this.roleInheritanceService.findByRoleId(roleId);

    if (roleInheritances.length) {
      for (const roleInheritance of roleInheritances) {
        let parent: Role;

        parent = await this.roleService.findOneByRoleId(roleInheritance.parentId);
        files = files.concat(...await this.getFilesByRoleId(parent.roleId));
      }
      files = files.concat(await this.fileService.findAllByRoleId(roleId));
    } else {
      return await this.fileService.findAllByRoleId(roleId); 
    }
    return files;
  }

  async checkPermission(buffer: string, userHostId: number) {
    let comamnds: string[] = [];
    let bufferList: string[] = [];
    let args: string[] = [];
    let roleAssignments: RoleAssignment[] = []
    let roleIds: number[] = []
    let userHostPermissions: Permission[] = []
    let commandPermissions: Permission[] = []
    let blockedFiles: File[] = []

    try {
      comamnds = this.extractCommand(buffer);
    } catch (err) {
      return false;
    }

    bufferList = buffer.split(' ')
    for (const arg of bufferList) {
      if (arg.startsWith('$(') && arg.endsWith(')')) {
        args.push(arg.slice(2, -1));
      } else if (arg.startsWith('`') && arg.endsWith('`')) {
        args.push(arg.slice(1, -1));
      } else {
        args.push(arg);
      }
    }
    args = args.filter(arg => !comamnds.includes(arg));

    roleAssignments = await this.roleAssignmentSrv.findAllByUserHostId(userHostId)
    roleIds = roleAssignments.map(roleAssignments => roleAssignments.roleId)
    
    for (const roleId of roleIds) {
      userHostPermissions = userHostPermissions.concat(await this.getPermissionsByRoleId(roleId))
      blockedFiles = blockedFiles.concat(await this.getFilesByRoleId(roleId))
    }

    for (const blockedFile of blockedFiles) {
      if (args.includes(blockedFile.path)) {
        return false;
      }
    }

    for (const command of comamnds) {
      commandPermissions = userHostPermissions.filter(permission => permission.object == command)
    }

    // implicit deny
    if (commandPermissions.length == 0) {
      return false;
    }

    // deny rule precedes allow rule
    for (let permission of commandPermissions) {
      if (!permission.allow) {
        return false;
      }
    }

    return true;
  }

  extractCommand(buffer: string): string[] {
    let ast: any = parse(buffer);
    let commands: string[] = [];

    traverse(ast, {
      Command(node) {
        if (node.name.text.startsWith('$(') && node.name.text.endsWith(')')) {
          commands.push(node.name.text.slice(2, -1));
        } else if (node.name.text.startsWith('`') && node.name.text.endsWith('`')) {
          commands.push(node.name.text.slice(1, -1));
        } else {
          commands.push(node.name.text);
        }
      },
    });

    return commands;
  }
}
