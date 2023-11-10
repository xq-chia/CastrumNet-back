export class CreateRoleDto {
    roleId: number;
    role: string;
    description: string;
    parentIds: number[];
}