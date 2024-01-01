import { Controller, Get, Headers, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { UsersService } from 'src/users/users.service';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('init')
export class InitController {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Get('app')
  async init(@Headers('token') token: string) {
    let clearToken: any;
    let res: any;
    let user: User;

    clearToken = this.jwtService.decode(token);
    res = {
      app: {},
      user: {},
      menu: []
    }

    if (token) {
      user = await this.usersService.findOneById(parseInt(clearToken.sub));
      res.app = {
          name: 'CastrumNet',
      }
      res.user = {
          name: user.firstName + ' ' + user.lastName,
          email: user.username,
      }
      if (clearToken.tenant == 'admin') {
        res.menu = [
          {
            text: 'Entity',
            group: true,
            hideInBreadcrumb: true,
            children: [
              {
                text: 'User',
                link: '/user/list'
              },
              {
                text: 'Host',
                link: '/host/list'
              }
            ]
          },
          {
            text: 'RBAC',
            group: true,
            hideInBreadcrumb: true,
            children: [
              {
                text: 'Role',
                link: '/role/list'
              },
              {
                text: 'Role Assignment',
                link: '/roleAssignment/list'
              },
              {
                text: 'Host Assignment',
                link: '/hostAssignment/list'
              }
            ]
          },
          {
            text: 'Workstation',
            group: true,
            hideInBreadcrumb: true,
            children: [
              {
                text: 'Workstation',
                link: '/workstation/list'
              }
            ]
          },
          {
            text: 'Account Details',
            link: '/profile/details',
            hide: true
          }
        ]
      } else {
        res.menu = [
          {
            text: 'Workstation',
            group: true,
            hideInBreadcrumb: true,
            children: [
              {
                text: 'Workstation',
                link: '/workstation/list'
              }
            ]
          }
        ]
      }

      return res;
    }
  }
}
