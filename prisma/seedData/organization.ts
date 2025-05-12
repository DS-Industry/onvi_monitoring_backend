import { StatusOrganization, TypeOrganization } from '@prisma/client';

export const Organizations = [
  {
    id: 10,
    name: 'DS',
    slug: 'DS',
    address: 'Воронеж',
    organizationStatus: StatusOrganization.ACTIVE,
    organizationType: TypeOrganization.LegalEntity,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    ownerId: 1,
  },
];
