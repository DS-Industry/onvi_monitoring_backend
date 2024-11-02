import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const washerCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Моечный пост',
      code: 'WASHER',
    },
  });
  const dryfogCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      name: 'Сухой туман',
      code: 'DRYFOG',
    },
  });
  const hooverCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Пылесос',
      code: 'HOOVER',
    },
  });
  const dryingCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Сушилка',
      code: 'DRYING',
    },
  });
  const mfuCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      name: 'МФУ',
      code: 'MFU',
    },
  });
  const vendingCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Вендинг',
      code: 'VENDING',
    },
  });
  const portalCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: 'Портал',
      code: 'PORTAL',
    },
  });
  const mobCarWashDeviceType = await prisma.carWashDeviceType.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      name: 'Терминал пополнения МП',
      code: 'MOBILETERMINAL',
    },
  });
  const errOperDev = await prisma.errNum.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      code: '-20008',
      message: 'Нет операций по устройству.',
    },
  });
  const errProg = await prisma.errNum.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      code: '-20003',
      message: 'Программа не найдена.',
    },
  });
  const errProgType = await prisma.errNum.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      code: '-20004',
      message: 'Не найден вид программы.',
    },
  });
  const errDev = await prisma.errNum.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      code: '-20001',
      message: 'Не найдено оборудование.',
    },
  });
  const errOper = await prisma.errNum.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      code: '-20002',
      message: 'Операция не найдена.',
    },
  });
  const currencyCoin = await prisma.currency.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      code: 'COIN',
      name: 'Монета',
      currencyType: 'CASH',
      currencyView: 'COIN',
    },
  });
  const currencyCash = await prisma.currency.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      code: 'CASH',
      name: 'Купюра',
      currencyType: 'CASH',
      currencyView: 'PAPER',
    },
  });
  const currencyJet = await prisma.currency.upsert({
    where: { id: 21 },
    update: {},
    create: {
      id: 21,
      code: 'JETTON',
      name: 'Жетон',
      currencyType: 'CASH',
    },
  });
  const currencyEur = await prisma.currency.upsert({
    where: { id: 22 },
    update: {},
    create: {
      id: 22,
      code: 'Eurokey',
      name: 'Eurokey (карта лояльности)',
      currencyType: 'CASH',
    },
  });
  const currencyNay = await prisma.currency.upsert({
    where: { id: 23 },
    update: {},
    create: {
      id: 23,
      code: 'Nayax',
      name: 'Оплата через POS терминал',
      currencyType: 'CASHLESS',
    },
  });
  const currencyEuro = await prisma.currency.upsert({
    where: { id: 24 },
    update: {},
    create: {
      id: 24,
      code: 'EURO',
      name: 'Евроценты',
      currencyType: 'CASH',
      currencyView: 'COIN',
    },
  });
  const currencyYa = await prisma.currency.upsert({
    where: { id: 25 },
    update: {},
    create: {
      id: 25,
      code: 'Yandex',
      name: 'Мобильное приложение Яндекс',
      currencyType: 'VIRTUAL',
    },
  });
  const currencyUz = await prisma.currency.upsert({
    where: { id: 26 },
    update: {},
    create: {
      id: 26,
      code: 'UZS',
      name: 'Сум',
      currencyType: 'CASH',
      currencyView: 'PAPER',
    },
  });
  const currencyAz = await prisma.currency.upsert({
    where: { id: 27 },
    update: {},
    create: {
      id: 27,
      code: 'AZN',
      name: 'Манат',
      currencyType: 'CASH',
      currencyView: 'PAPER',
    },
  });
  const currencyGap = await prisma.currency.upsert({
    where: { id: 28 },
    update: {},
    create: {
      id: 28,
      code: 'GAP',
      name: 'Гяпик',
      currencyType: 'CASH',
      currencyView: 'COIN',
    },
  });
  const currencyFpf = await prisma.currency.upsert({
    where: { id: 29 },
    update: {},
    create: {
      id: 29,
      code: 'FLASHPAY FPF',
      name: 'Мобильное приложение  Флеш FPF',
      currencyType: 'CASHLESS',
    },
  });
  const currencyDS = await prisma.currency.upsert({
    where: { id: 30 },
    update: {},
    create: {
      id: 30,
      code: 'Mobile Application Moy-ka! DS',
      name: 'Мобильное приложение Мой-Ка! DS',
      currencyType: 'CASH',
    },
  });
  const currencyGel = await prisma.currency.upsert({
    where: { id: 31 },
    update: {},
    create: {
      id: 31,
      code: 'GEL',
      name: 'Лари',
      currencyType: 'CASH',
      currencyView: 'PAPER',
    },
  });
  const currencyGet = await prisma.currency.upsert({
    where: { id: 32 },
    update: {},
    create: {
      id: 32,
      code: 'GET',
      name: 'Лари/Тетри',
      currencyType: 'CASH',
      currencyView: 'COIN',
    },
  });
  const currencyByn = await prisma.currency.upsert({
    where: { id: 33 },
    update: {},
    create: {
      id: 33,
      code: 'BYN_R',
      name: 'Белорусский рубель',
      currencyType: 'CASH',
    },
  });
  const currencyBynK = await prisma.currency.upsert({
    where: { id: 34 },
    update: {},
    create: {
      id: 34,
      code: 'BYN_K',
      name: 'Белорусская капейка',
      currencyType: 'CASH',
    },
  });
  const currencyFPB = await prisma.currency.upsert({
    where: { id: 35 },
    update: {},
    create: {
      id: 35,
      code: 'FLASHPAY FPB',
      name: 'Мобильное приложение Флеш FPB',
      currencyType: 'CASHLESS',
    },
  });
  const currencyEgp = await prisma.currency.upsert({
    where: { id: 36 },
    update: {},
    create: {
      id: 36,
      code: 'EGP',
      name: 'Египетский фунт',
      currencyType: 'CASH',
    },
  });
  const currencyLukoil = await prisma.currency.upsert({
    where: { id: 37 },
    update: {},
    create: {
      id: 37,
      code: 'Lukoil',
      name: 'Мобильное приложение Лукойл',
      currencyType: 'CASHLESS',
    },
  });
  const currencyDinr = await prisma.currency.upsert({
    where: { id: 38 },
    update: {},
    create: {
      id: 38,
      code: 'Dinr',
      name: 'Оплата по QR коду Индия',
      currencyType: 'CASHLESS',
    },
  });
  const currencyOnvi = await prisma.currency.upsert({
    where: { id: 39 },
    update: {},
    create: {
      id: 39,
      code: 'Onvi',
      name: 'Мобильное приложение Onvi',
      currencyType: 'CASHLESS',
    },
  });
  const eventTypeSum = await prisma.carWashDeviceEventType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Внесение суммы',
    },
  });
  const eventTypeWork = await prisma.carWashDeviceEventType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Включение режима работы',
    },
  });
  const eventTypeOpen = await prisma.carWashDeviceEventType.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Открытие дверцы',
    },
  });
  const eventTypeClose = await prisma.carWashDeviceEventType.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: 'Закрытие дверцы',
    },
  });
  const eventTypeContr = await prisma.carWashDeviceEventType.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      name: 'Запуск контролера',
    },
  });
  const eventTypePower = await prisma.carWashDeviceEventType.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      name: 'Отключение питания контролера',
    },
  });
  const eventTypeTime = await prisma.carWashDeviceEventType.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      name: 'Перезапуск от сторожевого таймера',
    },
  });
  const eventTypeInk = await prisma.carWashDeviceEventType.upsert({
    where: { id: 9 },
    update: {},
    create: {
      id: 9,
      name: 'Инкассация',
    },
  });
  const program1 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      code: 'SOAP',
      name: 'Вода + шампунь',
      carWashDeviceTypeId: 1,
      orderNum: 3,
    },
  });
  const program2 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      code: 'TIRE',
      name: 'Мойка дисков',
      carWashDeviceTypeId: 1,
      orderNum: 1,
    },
  });
  const program3 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      code: 'PRESOAK',
      name: 'Активная химия',
      carWashDeviceTypeId: 1,
      orderNum: 2,
    },
  });
  const program4 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      code: 'BRUSH',
      name: 'Щетка + пена',
      carWashDeviceTypeId: 1,
      orderNum: 4,
    },
  });
  const program5 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      code: 'WATER',
      name: 'Ополаскивание',
      carWashDeviceTypeId: 1,
      orderNum: 5,
    },
  });
  const program6 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      code: 'WAX',
      name: 'Воск + защита',
      carWashDeviceTypeId: 1,
      orderNum: 6,
    },
  });
  const program7 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      code: 'OSMOS',
      name: 'Ополаскивание без разводов',
      carWashDeviceTypeId: 1,
      orderNum: 7,
    },
  });
  const program8 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      code: 'COMBO1',
      name: 'Комбинация 1',
      carWashDeviceTypeId: 5,
    },
  });
  const program9 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 9 },
    update: {},
    create: {
      id: 9,
      code: 'COMBO2',
      name: 'Комбинация 2',
      carWashDeviceTypeId: 5,
    },
  });
  const program10 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 10 },
    update: {},
    create: {
      id: 10,
      code: 'TPOWER',
      name: 'T-Power',
      carWashDeviceTypeId: 1,
      orderNum: 8,
    },
  });
  const program11 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 11 },
    update: {},
    create: {
      id: 11,
      name: 'Горячая вода',
      carWashDeviceTypeId: 1,
    },
  });
  const program12 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 12 },
    update: {},
    create: {
      id: 12,
      name: 'Обезжирка',
      carWashDeviceTypeId: 1,
    },
  });
  const program13 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 13 },
    update: {},
    create: {
      id: 13,
      code: 'COMBO3',
      name: 'Комбинация 3',
      carWashDeviceTypeId: 5,
    },
  });
  const program14 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 14 },
    update: {},
    create: {
      id: 14,
      code: 'COMBO4',
      name: 'Комбинация 4',
      carWashDeviceTypeId: 5,
    },
  });
  const program15 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 15 },
    update: {},
    create: {
      id: 15,
      code: 'DOPFUNC1',
      name: 'Доп. функция 1',
      carWashDeviceTypeId: 5,
    },
  });
  const program16 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 16 },
    update: {},
    create: {
      id: 16,
      code: 'DOPFUNC1',
      name: 'Доп. функция 2',
      carWashDeviceTypeId: 5,
    },
  });
  const program17 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 17 },
    update: {},
    create: {
      id: 17,
      code: 'DOPFUNC1',
      name: 'Доп. функция 3',
      carWashDeviceTypeId: 5,
    },
  });
  const program18 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 18 },
    update: {},
    create: {
      id: 18,
      name: 'Экспресс',
      carWashDeviceTypeId: 5,
      description: 'Для заправок Flash',
    },
  });
  const program19 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 19 },
    update: {},
    create: {
      id: 19,
      name: 'Стандарт',
      carWashDeviceTypeId: 5,
      description: 'Для заправок Flash',
    },
  });
  const program20 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 20 },
    update: {},
    create: {
      id: 20,
      name: 'Премиум',
      carWashDeviceTypeId: 5,
      description: 'Для заправок Flash',
    },
  });
  const program21 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 21 },
    update: {},
    create: {
      id: 21,
      name: 'Пылесос',
      carWashDeviceTypeId: 2,
      description: 'Для регистрации пылесоса.',
    },
  });
  const program22 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 22 },
    update: {},
    create: {
      id: 22,
      name: 'Воздух',
      carWashDeviceTypeId: 1,
    },
  });
  const program23 = await prisma.carWashDeviceProgramsType.upsert({
    where: { id: 23 },
    update: {},
    create: {
      id: 23,
      name: 'Летняя',
      carWashDeviceTypeId: 5,
    },
  });
  const objectOrg = await prisma.objectPermissions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Organization',
    },
  });
  const objectPos = await prisma.objectPermissions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Pos',
    },
  });
  const objectIncident = await prisma.objectPermissions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Incident',
    },
  });
  const userPermissionsOrgManage = await prisma.userPermission.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      action: 'manage',
      objectId: 1,
    },
  });
  const userPermissionsOrgCreate = await prisma.userPermission.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      action: 'create',
      objectId: 1,
    },
  });
  const userPermissionsOrgUpdate = await prisma.userPermission.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      action: 'update',
      objectId: 1,
    },
  });
  const userPermissionsOrgRead = await prisma.userPermission.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      action: 'read',
      objectId: 1,
    },
  });
  const userPermissionsOrgDelete = await prisma.userPermission.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      action: 'delete',
      objectId: 1,
    },
  });
  const userPermissionsPosManage = await prisma.userPermission.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      action: 'manage',
      objectId: 2,
    },
  });
  const userPermissionsPosCreate = await prisma.userPermission.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      action: 'create',
      objectId: 2,
    },
  });
  const userPermissionsPosUpdate = await prisma.userPermission.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      action: 'update',
      objectId: 2,
    },
  });
  const userPermissionsPosRead = await prisma.userPermission.upsert({
    where: { id: 9 },
    update: {},
    create: {
      id: 9,
      action: 'read',
      objectId: 2,
    },
  });
  const userPermissionsPosDelete = await prisma.userPermission.upsert({
    where: { id: 10 },
    update: {},
    create: {
      id: 10,
      action: 'delete',
      objectId: 2,
    },
  });
  const userPermissionsIncidentManage = await prisma.userPermission.upsert({
    where: { id: 11 },
    update: {},
    create: {
      id: 11,
      action: 'manage',
      objectId: 3,
    },
  });
  const userPermissionsIncidentCreate = await prisma.userPermission.upsert({
    where: { id: 12 },
    update: {},
    create: {
      id: 12,
      action: 'create',
      objectId: 3,
    },
  });
  const userPermissionsIncidentUpdate = await prisma.userPermission.upsert({
    where: { id: 13 },
    update: {},
    create: {
      id: 13,
      action: 'update',
      objectId: 3,
    },
  });
  const userPermissionsIncidentRead = await prisma.userPermission.upsert({
    where: { id: 14 },
    update: {},
    create: {
      id: 14,
      action: 'read',
      objectId: 3,
    },
  });
  const userPermissionsIncidentDelete = await prisma.userPermission.upsert({
    where: { id: 15 },
    update: {},
    create: {
      id: 15,
      action: 'delete',
      objectId: 3,
    },
  });
  const userRoleOwner = await prisma.userRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
        ],
      },
    },
  });
  const userRoleAdmin = await prisma.userRole.upsert({
    where: { id: 2 },
    update: {},
    create: {
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
        ],
      },
    },
  });
  const userRoleManager = await prisma.userRole.upsert({
    where: { id: 3 },
    update: {},
    create: {
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
  });
  console.log({
    //organization,
    washerCarWashDeviceType,
    dryfogCarWashDeviceType,
    hooverCarWashDeviceType,
    dryingCarWashDeviceType,
    mfuCarWashDeviceType,
    vendingCarWashDeviceType,
    portalCarWashDeviceType,
    mobCarWashDeviceType,
    errOperDev,
    errProg,
    errProgType,
    errDev,
    errOper,
    currencyCoin,
    currencyCash,
    currencyJet,
    currencyEur,
    currencyNay,
    currencyEuro,
    currencyYa,
    currencyUz,
    currencyAz,
    currencyGap,
    currencyFpf,
    currencyDS,
    currencyGel,
    currencyGet,
    currencyByn,
    currencyBynK,
    currencyFPB,
    currencyEgp,
    currencyLukoil,
    currencyDinr,
    currencyOnvi,
    eventTypeSum,
    eventTypeWork,
    eventTypeOpen,
    eventTypeClose,
    eventTypeContr,
    eventTypePower,
    eventTypeTime,
    eventTypeInk,
    program1,
    program2,
    program3,
    program4,
    program5,
    program6,
    program7,
    program8,
    program9,
    program10,
    program11,
    program12,
    program13,
    program14,
    program15,
    program16,
    program17,
    program18,
    program19,
    program20,
    program21,
    program22,
    program23,
    objectOrg,
    objectPos,
    userPermissionsOrgManage,
    userPermissionsOrgCreate,
    userPermissionsOrgUpdate,
    userPermissionsOrgRead,
    userPermissionsOrgDelete,
    userPermissionsPosManage,
    userPermissionsPosCreate,
    userPermissionsPosUpdate,
    userPermissionsPosRead,
    userPermissionsPosDelete,
    userRoleOwner,
    userRoleAdmin,
    userRoleManager,
  });
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
