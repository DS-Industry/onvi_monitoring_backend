import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'org',
      slug: 'org',
      address: {
        create: {
          city: 'Voronez',
          location: 'dom 36',
          lat: 3,
          lon: 4,
        },
      },
      organizationDocuments: 'document',
      organizationStatus: 'active',
      organizationType: 'OOO',
      createdAt: '2024-01-24T12:00:00Z',
      updatedAt: '2024-01-24T12:00:00Z',
      owner: {
        create: {
          userRole: {
            create: {
              name: 'Owner',
              userPermissions: {
                create: [
                  {
                    action: 'manage',
                    object: {
                      create: {
                        name: 'subscription',
                      },
                    },
                  },
                  {
                    action: 'create',
                    object: {
                      create: {
                        name: 'subscription',
                      },
                    },
                  },
                ],
              },
            },
          },
          name: 'Dima',
          surname: 'Bychenko',
          middlename: 'Andr',
          birthday: '2024-01-24T12:00:00Z',
          phone: '123456',
          email: 'test@mail.ru',
          password: '123',
          gender: 'men',
          status: 'ACTIVE',
          avatar: 'png',
          country: 'Voronez',
          countryCode: 36,
          timezone: 1,
          refreshTokenId: 'dsafnfjknj32njnj',
          createdAt: '2024-01-24T12:00:00Z',
          updatedAt: '2024-01-24T12:00:00Z',
        },
      },
      users: {
        create: [
          {
            name: 'Pypa',
            surname: 'Dupa',
            middlename: 'lol',
            birthday: '2024-01-24T12:00:00Z',
            phone: '43245425',
            email: 'pupa@mail.ru',
            password: '123',
            gender: 'man',
            status: 'ACTIVE',
            avatar: 'png',
            country: 'Voronez',
            countryCode: 36,
            timezone: 1,
            refreshTokenId: 'dsafnfjknj32njnj',
            createdAt: '2024-01-24T12:00:00Z',
            updatedAt: '2024-01-24T12:00:00Z',
            userRoleId: 2,
          },
          {
            name: 'Lypa',
            surname: 'Kupa',
            middlename: 'kek',
            birthday: '2024-01-24T12:00:00Z',
            phone: '89480840',
            email: 'lupa@mail.ru',
            password: '123',
            gender: 'man',
            status: 'ACTIVE',
            avatar: 'png',
            country: 'Voronez',
            countryCode: 36,
            timezone: 1,
            refreshTokenId: 'dsafnfjknj32njnj',
            createdAt: '2024-01-24T12:00:00Z',
            updatedAt: '2024-01-24T12:00:00Z',
            userRoleId: 2,
          },
        ],
      },
    },
  });
  const pos = await prisma.pos.upsert({
    where: { id: 1 },
    update: {},
    create: {
      loyaltyProgram: {
        create: {
          name: 'Gold',
        },
      },
      name: 'Brusilova',
      slug: 'Brus',
      monthlyPlan: 10000,
      organization: {
        connect: {
          id: 1,
        },
      },
      posMetaData: 'META',
      timezone: 1,
      address: {
        create: {
          city: 'Voronez',
          location: 'Brysilova',
          lat: 300,
          lon: 400,
        },
      },
      image: 'png',
      rating: 5,
      status: 'Active',
      createdAt: '2024-01-24T12:00:00Z',
      updatedAt: '2024-01-24T12:00:00Z',
      createdBy: {
        connect: {
          id: 1,
        },
      },
      updateBy: {
        connect: {
          id: 1,
        },
      },
    },
  });

  const cw = await prisma.carWashPos.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'CarWash',
      slug: 'CW',
      pos: {
        connect: {
          id: 1,
        },
      },
      carWashDevices: {
        create: [
          {
            name: 'Post 1',
            carWashDeviceMetaData: 'Good',
            status: 'Active',
            ipAddress: '12.34.3424',
            carWashDeviceType: {
              create: {
                name: 'Portal',
                code: 'PORTAL',
              },
            },
          },
          {
            name: 'Post 2',
            carWashDeviceMetaData: 'Bad',
            status: 'No active',
            ipAddress: '15.84.3424',
            carWashDeviceType: {
              create: {
                name: 'Fen',
                code: 'FEN',
              },
            },
          },
        ],
      },
      carWashServices: {
        create: [
          {
            name: 'Clean',
            code: 'CLEAN',
            description: 'Best',
          },
        ],
      },
    },
  });
  console.log({ org, pos });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
