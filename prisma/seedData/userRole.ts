export const UserRoles = [
  {
    id: 1,
    name: 'Owner',
    userPermissions: {
      connect: [
        {
          id: 1,
        },
        {
          id: 6,
        },
        {
          id: 11,
        },
        {
          id: 16,
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Admin',
    userPermissions: {
      connect: [
        {
          id: 1,
        },
        {
          id: 6,
        },
        {
          id: 11,
        },
        {
          id: 16,
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Manager',
    userPermissions: {
      connect: [
        {
          id: 4,
        },
        {
          id: 9,
        },
        {
          id: 14,
        },
      ],
    },
  },
];
