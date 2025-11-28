export interface PermissionsInfoResponseDto {
  role: string;
  permissions: PermissionsDto[];
}

export interface PermissionsDto {
  action: string;
  subject: string;
}
