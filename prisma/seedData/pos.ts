import { StatusPos } from '@prisma/client';

export const Poses = [
  {
    id: 66,
    name: '36 М-15 Брусилова 4Г',
    slug: '36_М-15_Брусилова_4Г',
    organizationId: 10,
    timezone: 36,
    status: StatusPos.ACTIVE,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    createdById: 1,
    updateById: 1,
    carWashPos: {
      create: {
        id: 66,
        name: '36 М-15 Брусилова 4Г',
        slug: '36_М-15_Брусилова_4Г',
        carWashDeviceProgramTypes: {
          connect: [
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 5,
            },
            {
              id: 6,
            },
            {
              id: 7,
            },
            {
              id: 10,
            },
          ],
        },
      },
    },
  },
];
