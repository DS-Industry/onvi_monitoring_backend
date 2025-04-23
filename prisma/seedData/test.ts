import {
  CarWashPosType,
  StatusOrganization,
  StatusPos,
  TypeOrganization
} from "@prisma/client";

export const test = [
  {
    id: 9991,
    name: 'Пост 1',
    carWashDeviceMetaData: 'carWashDeviceMetaData',
    status: 'ACTIVE',
    ipAddress: 'ipAddress',
    carWashDeviceTypeId: 1,
    carWashPosId: 9998,
  },
  {
    id: 9992,
    name: 'Пост 2',
    carWashDeviceMetaData: 'carWashDeviceMetaData',
    status: 'ACTIVE',
    ipAddress: 'ipAddress',
    carWashDeviceTypeId: 1,
    carWashPosId: 9998,
  },
  {
    id: 9993,
    name: 'Пылесос 1',
    carWashDeviceMetaData: 'carWashDeviceMetaData',
    status: 'ACTIVE',
    ipAddress: 'ipAddress',
    carWashDeviceTypeId: 2,
    carWashPosId: 9998,
  },
  {
    id: 9994,
    name: 'Робот 1',
    carWashDeviceMetaData: 'carWashDeviceMetaData',
    status: 'ACTIVE',
    ipAddress: 'ipAddress',
    carWashDeviceTypeId: 5,
    carWashPosId: 66,
  },
];
