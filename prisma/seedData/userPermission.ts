import { PermissionAction } from '@prisma/client';

export const UserPermissions: {
  id: number;
  action: PermissionAction;
  objectId: number;
}[] = [
  {
    id: 1,
    action: 'manage',
    objectId: 1,
  },
  {
    id: 2,
    action: 'create',
    objectId: 1,
  },
  {
    id: 3,
    action: 'update',
    objectId: 1,
  },
  {
    id: 4,
    action: 'read',
    objectId: 1,
  },
  {
    id: 5,
    action: 'delete',
    objectId: 1,
  },
  {
    id: 6,
    action: 'manage',
    objectId: 2,
  },
  {
    id: 7,
    action: 'create',
    objectId: 2,
  },
  {
    id: 8,
    action: 'update',
    objectId: 2,
  },
  {
    id: 9,
    action: 'read',
    objectId: 2,
  },
  {
    id: 10,
    action: 'delete',
    objectId: 2,
  },
  {
    id: 11,
    action: 'manage',
    objectId: 3,
  },
  {
    id: 12,
    action: 'create',
    objectId: 3,
  },
  {
    id: 13,
    action: 'update',
    objectId: 3,
  },
  {
    id: 14,
    action: 'read',
    objectId: 3,
  },
  {
    id: 15,
    action: 'delete',
    objectId: 3,
  },
  {
    id: 16,
    action: 'manage',
    objectId: 4,
  },
  {
    id: 17,
    action: 'create',
    objectId: 4,
  },
  {
    id: 18,
    action: 'update',
    objectId: 4,
  },
  {
    id: 19,
    action: 'read',
    objectId: 4,
  },
  {
    id: 20,
    action: 'delete',
    objectId: 4,
  },
  {
    id: 21,
    action: 'manage',
    objectId: 5,
  },
  {
    id: 22,
    action: 'create',
    objectId: 5,
  },
  {
    id: 23,
    action: 'update',
    objectId: 5,
  },
  {
    id: 24,
    action: 'read',
    objectId: 5,
  },
  {
    id: 25,
    action: 'delete',
    objectId: 5,
  },
  {
    id: 26,
    action: 'manage',
    objectId: 6,
  },
  {
    id: 27,
    action: 'create',
    objectId: 6,
  },
  {
    id: 28,
    action: 'update',
    objectId: 6,
  },
  {
    id: 29,
    action: 'read',
    objectId: 6,
  },
  {
    id: 30,
    action: 'delete',
    objectId: 6,
  },
];
