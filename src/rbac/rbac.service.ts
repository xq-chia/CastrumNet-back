import { Inject, Injectable } from '@nestjs/common';
import { Permission } from 'src/entity/permission.entity';
import { Connection } from 'mariadb';
import * as parse from 'bash-parser'
import * as traverse from 'bash-ast-traverser';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RbacService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection,
    private permissisonService: PermissionService,
  ) {}

  async checkPermission(buffer: string): Promise<boolean> {
    let permissions: Permission[] = [];
    let commands: string[] = [];

    commands = this.extractCommand(buffer);

    for await (let command of commands) {
      permissions = permissions.concat(await this.permissisonService.findByObject(command));
    }

    // implicit deny
    if (permissions.length == 0) {
      return false;
    }

    // deny rule precedes allow rule
    for (let permission of permissions) {
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
        } else {
          commands.push(node.name.text);
        }
      },
    });

    return commands;
  }
}
