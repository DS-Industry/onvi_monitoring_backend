import { ManagerPaperTypeClass } from '@prisma/client';

export const ManagerPaperTypes = [
  {
    id: 1,
    name: 'Расходы на кофе машину',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 2,
    name: 'Продукция для вендинга',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 3,
    name: 'Жидкость для омывания стекол',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 4,
    name: 'Аренда,переменная часть АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 5,
    name: 'Аренда помещения АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 6,
    name: 'Аренда земли под АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 7,
    name: 'Аренда земли,оборудование АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 8,
    name: 'Аренда(коммунальные расходы)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 9,
    name: 'Канцелярские расходы на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 10,
    name: 'Форма сотрудников АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 11,
    name: 'Хозяйственные расходы АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 12,
    name: 'Компенсация расходов(выплачено на р/с)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 13,
    name: 'Водоснабжение АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 14,
    name: 'Газоснабжение АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 15,
    name: 'Теплоснабжение АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 16,
    name: 'Электроснабжение АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 17, name: 'Вывоз ЖБО/Илосос', type: ManagerPaperTypeClass.EXPENDITURE },
  { id: 18, name: 'Вывоз ТБО с АМС', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 19,
    name: 'Расходы на интернет АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 20,
    name: 'Музыка(авторские права на АМС)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 21, name: 'Охрана АМС', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 22,
    name: 'Обслуживание системы отопления АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 23,
    name: 'On-Line трансляции(Ivideon)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 24,
    name: 'Химический анализ стоков',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 25, name: 'Спец.одежда', type: ManagerPaperTypeClass.EXPENDITURE },
  { id: 26, name: 'Инвентарь АМС', type: ManagerPaperTypeClass.EXPENDITURE },
  { id: 27, name: 'Мебель на АМС', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 28,
    name: 'Оргтехника на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 29,
    name: 'Инструмент для АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 30,
    name: 'Доп.оборудование на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 31, name: 'Автохимия', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 32,
    name: 'Дизтопливо для АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 33,
    name: 'Наклейки информационные на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 34,
    name: 'Реагент(соль поваренная в мешках)для АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 35,
    name: 'Соль таблетированная',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 36,
    name: 'Лабороторные исследования на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 37,
    name: 'Рекламные материалы услуг АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 38,
    name: 'Рекламные услуги сторонних организаций для АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 39,
    name: 'Реконструкция АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 40,
    name: 'Благоустройство территории АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 41,
    name: 'Ремонт системы водоотведения АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 42,
    name: 'Ремонт систем водоснабжения АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 43,
    name: 'Ремонт систем освещения АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 44,
    name: 'Ремонт сооружений АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 45,
    name: 'Зап.части на оборудование АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 46, name: 'Расходники ТО', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 47,
    name: 'Услуги по ремонту,диагностике,тех.обслуживанию',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 48,
    name: 'Командировочные расходы по АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 49,
    name: 'Представительские расходы на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 50,
    name: 'ТО Контрольно-кассовой техники',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 51,
    name: 'Услуги банка(эксплуатация АМС)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 52, name: 'Услуги ИП', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 53,
    name: 'Услуги связи на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 54, name: '% от выручки АМС', type: ManagerPaperTypeClass.EXPENDITURE },
  {
    id: 55,
    name: 'Возвраты клиентам',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 56,
    name: 'Услуги сторонних организаций для АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 57,
    name: 'Прочее(эксплуатация АМС)',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 58,
    name: 'Транспортные услуги.доставка на АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 59,
    name: 'ГСМ сотрудников АМС',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 60,
    name: 'Экологическое сопровождение',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 61,
    name: 'Проведение экспертизы/лабороторныйе исследования',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 62,
    name: 'Плата за размещения отходов',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  {
    id: 63,
    name: 'Сброс загрязняющих веществ',
    type: ManagerPaperTypeClass.EXPENDITURE,
  },
  { id: 64, name: 'Инкассация', type: ManagerPaperTypeClass.RECEIPT },
];
