import { CurrencyType, CurrencyView } from '@prisma/client';

export const Currencies: {
  id: number;
  code: string;
  name: string;
  currencyType: CurrencyType;
  currencyView?: CurrencyView;
}[] = [
  {
    id: 1,
    code: 'COIN',
    name: 'Монета',
    currencyType: 'CASH',
    currencyView: 'COIN',
  },
  {
    id: 2,
    code: 'CASH',
    name: 'Купюра',
    currencyType: 'CASH',
    currencyView: 'PAPER',
  },
  {
    id: 21,
    code: 'JETTON',
    name: 'Жетон',
    currencyType: 'CASH',
  },
  {
    id: 22,
    code: 'Eurokey',
    name: 'Eurokey (карта лояльности)',
    currencyType: 'CASH',
  },
  {
    id: 23,
    code: 'Nayax',
    name: 'Оплата через POS терминал',
    currencyType: 'CASHLESS',
  },
  {
    id: 24,
    code: 'EURO',
    name: 'Евроценты',
    currencyType: 'CASH',
    currencyView: 'COIN',
  },
  {
    id: 25,
    code: 'Yandex',
    name: 'Мобильное приложение Яндекс',
    currencyType: 'VIRTUAL',
  },
  {
    id: 26,
    code: 'UZS',
    name: 'Сум',
    currencyType: 'CASH',
    currencyView: 'PAPER',
  },
  {
    id: 27,
    code: 'AZN',
    name: 'Манат',
    currencyType: 'CASH',
    currencyView: 'PAPER',
  },
  {
    id: 28,
    code: 'GAP',
    name: 'Гяпик',
    currencyType: 'CASH',
    currencyView: 'COIN',
  },
  {
    id: 29,
    code: 'FLASHPAY FPF',
    name: 'Мобильное приложение  Флеш FPF',
    currencyType: 'CASHLESS',
  },
  {
    id: 30,
    code: 'Mobile Application Moy-ka! DS',
    name: 'Мобильное приложение Мой-Ка! DS',
    currencyType: 'CASH',
  },
  {
    id: 31,
    code: 'GEL',
    name: 'Лари',
    currencyType: 'CASH',
    currencyView: 'PAPER',
  },
  {
    id: 32,
    code: 'GET',
    name: 'Лари/Тетри',
    currencyType: 'CASH',
    currencyView: 'COIN',
  },
  {
    id: 33,
    code: 'BYN_R',
    name: 'Белорусский рубель',
    currencyType: 'CASH',
  },
  {
    id: 34,
    code: 'BYN_K',
    name: 'Белорусская капейка',
    currencyType: 'CASH',
  },
  {
    id: 35,
    code: 'FLASHPAY FPB',
    name: 'Мобильное приложение Флеш FPB',
    currencyType: 'CASHLESS',
  },
  {
    id: 36,
    code: 'EGP',
    name: 'Египетский фунт',
    currencyType: 'CASH',
  },
  {
    id: 37,
    code: 'Lukoil',
    name: 'Мобильное приложение Лукойл',
    currencyType: 'CASHLESS',
  },
  {
    id: 38,
    code: 'Dinr',
    name: 'Оплата по QR коду Индия',
    currencyType: 'CASHLESS',
  },
  {
    id: 39,
    code: 'Onvi',
    name: 'Мобильное приложение Onvi',
    currencyType: 'CASHLESS',
  },
];
