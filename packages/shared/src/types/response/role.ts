export interface AdminRoleResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: AdminPermissionResponse[];
  _count: {
    users: number;
  };
}

export interface AdminPermissionResponse {
  id: string;
  name: string;
}
