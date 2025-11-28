import { PrismaClient, StatusPos } from '@prisma/client';

const prisma = new PrismaClient();
import { DeviceTypes } from './seedData/deviceType';
import { Errs } from './seedData/err';
import { Currencies } from './seedData/currency';
import { EventTypes } from './seedData/eventType';
import { ProgramTypes } from './seedData/programType';
import { Objects } from './seedData/object';
import { UserPermissions } from './seedData/userPermission';
import { UserRoles } from './seedData/userRole';
import { TechTaskItemTemplate } from './seedData/techTaskItemTemplate';
import { Organizations } from './seedData/organization';
import { Poses } from './seedData/pos';
import { Devices } from './seedData/device';
import { test } from './seedData/test';
import { EquipmentKnot } from "./seedData/equipmentKnot";
import { IncidentInfos } from "./seedData/incidentInfo";
import { IncidentNames } from "./seedData/incidentName";
import { Warehouses } from "./seedData/warehouse";
import { ManagerPaperTypes } from "./seedData/managerPaperType";

async function main() {
  //DeviceType
  /*await Promise.all(
    DeviceTypes.map(async (deviceType) => {
      await prisma.carWashDeviceType.upsert({
        where: { id: deviceType.id },
        update: {},
        create: deviceType,
      });
    }),
  );
  console.log('DeviceType create');
  //Err
  await Promise.all(
    Errs.map(async (err) => {
      await prisma.errNum.upsert({
        where: { id: err.id },
        update: {},
        create: err,
      });
    }),
  );
  console.log('Err create');

  //Currency
  await Promise.all(
    Currencies.map(async (currency) => {
      await prisma.currency.upsert({
        where: { id: currency.id },
        update: {},
        create: currency,
      });
    }),
  );
  console.log('Currency create');
  //EventTypes
  await Promise.all(
    EventTypes.map(async (eventType) => {
      await prisma.carWashDeviceEventType.upsert({
        where: { id: eventType.id },
        update: {},
        create: eventType,
      });
    }),
  );
  console.log('EventType create');
  //ProgramTypes
  await Promise.all(
    ProgramTypes.map(async (programType) => {
      await prisma.carWashDeviceProgramsType.upsert({
        where: { id: programType.id },
        update: {},
        create: programType,
      });
    }),
  );
  console.log('ProgramType create');
  //Objects
  await Promise.all(
    Objects.map(async (object) => {
      await prisma.objectPermissions.upsert({
        where: { id: object.id },
        update: {},
        create: object,
      });
    }),
  );
  console.log('Object create');
  //UserPermissions
  await Promise.all(
    UserPermissions.map(async (userPermission) => {
      await prisma.userPermission.upsert({
        where: { id: userPermission.id },
        update: {},
        create: userPermission,
      });
    }),
  );
  console.log('UserPermission create');
  //UserRoles
  await Promise.all(
    UserRoles.map(async (userRole) => {
      await prisma.userRole.upsert({
        where: { id: userRole.id },
        update: userRole,
        create: userRole,
      });
    }),
  );
  console.log('UserRole create');
  //TechTaskItemTemplate
  await Promise.all(
    TechTaskItemTemplate.map(async (itemTemplate) => {
      await prisma.techTaskItemTemplate.upsert({
        where: { id: itemTemplate.id },
        update: itemTemplate,
        create: itemTemplate,
      });
    }),
  );
  console.log('TechTaskItemTemplate create');
  //EquipmentKnot
  await Promise.all(
    EquipmentKnot.map(async (equipment) => {
      await prisma.equipmentKnot.upsert({
        where: { id: equipment.id },
        update: equipment,
        create: equipment,
      });
    }),
  );
  console.log('equipmentKnot create')
  //IncidentName
  await Promise.all(
    IncidentNames.map(async (incidentName) => {
      await prisma.incidentName.upsert({
        where: { id: incidentName.id },
        update: incidentName,
        create: incidentName,
      });
    }),
  );
  console.log('incidentInfo create');
  //IncidentInfo
  await Promise.all(
    IncidentInfos.map(async (incidentInfo) => {
      await prisma.incidentInfo.upsert({
        where: { id: incidentInfo.id },
        update: incidentInfo,
        create: incidentInfo,
      });
    }),
  );
  console.log('incidentInfo create');*/
  //ManagerPaperType
  await Promise.all(
    ManagerPaperTypes.map(async (managerPaperType) => {
      await prisma.managerPaperType.upsert({
        where: { id: managerPaperType.id },
        update: managerPaperType,
        create: managerPaperType,
      });
    }),
  );
  console.log('managerPaperType create');
  /*await Promise.all(
    Organizations.map(async (organization) => {
      await prisma.organization.upsert({
        where: { id: organization.id },
        update: {},
        create: organization,
      });
    }),
  );
  console.log('Organization create');
  await Promise.all(
    Poses.map(async (pos) => {
      prisma.pos.upsert({
        where: { id: pos.id },
        update: {},
        create: pos,
      });
    }),
  );
  console.log('Pos create');
  await Promise.all(
    Devices.map(async (device) => {
      prisma.carWashDevice.upsert({
        where: { id: device.id },
        update: {},
        create: device,
      });
    }),
  );
  console.log('Device create');
    //Warehouse
  await Promise.all(
    Warehouses.map(async (warehouse) => {
      await prisma.warehouse.upsert({
        where: { id: warehouse.id },
        update: warehouse,
        create: warehouse,
      });
    }),
  );
  console.log('Warehouse create');*/
  /*await Promise.all(
    test.map(async (test) => {
      await prisma.carWashDevice.upsert({
        where: { id: test.id },
        update: {},
        create: test,
      });
    }),
  );
  console.log('Organization create');*/
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
