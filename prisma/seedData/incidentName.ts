export const IncidentNames = [
  // Электроснабжение (id: 1)
  {
    id: 1,
    name: 'Нет электричества',
    equipmentKnots: { connect: [{ id: 1 }] },
  },
  { id: 2, name: 'выбивает автомат', equipmentKnots: { connect: [{ id: 1 }] } },
  { id: 3, name: 'ошибка ПЧВ', equipmentKnots: { connect: [{ id: 1 }] } },

  // Шатлл робота (id: 2)
  {
    id: 4,
    name: 'Индуктивный датчик положения консоли',
    equipmentKnots: { connect: [{ id: 2 }] },
  },
  { id: 5, name: 'Электродвигатель', equipmentKnots: { connect: [{ id: 2 }] } },
  { id: 6, name: 'Консоль', equipmentKnots: { connect: [{ id: 2 }] } },
  { id: 7, name: 'Ремень зубчатый', equipmentKnots: { connect: [{ id: 2 }] } },
  { id: 8, name: 'Подшипник', equipmentKnots: { connect: [{ id: 2 }] } },
  { id: 9, name: 'Ролик шатлла', equipmentKnots: { connect: [{ id: 2 }] } },

  // Установка обратного осмоса (id: 3)
  {
    id: 10,
    name: 'Корпус мембранный',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 11,
    name: 'Мембрана обратного осмоса',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 12,
    name: 'Электронасос многоступенчатый',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 13,
    name: 'Станина из нержавеющей стали',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 14,
    name: 'Электромагнитный клапан',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 15,
    name: 'Реле контроля напряжения',
    equipmentKnots: { connect: [{ id: 3 }] },
  },
  {
    id: 16,
    name: 'Прочие гидрокомпоненты',
    equipmentKnots: { connect: [{ id: 3 }] },
  },

  // Установка насосная T-power (id: 4)
  { id: 17, name: 'насос дозатор', equipmentKnots: { connect: [{ id: 4 }] } },
  {
    id: 18,
    name: 'прочие компоненты(пиши в примечании)',
    equipmentKnots: { connect: [{ id: 4 }] },
  },
  { id: 19, name: 'пенный пстолет', equipmentKnots: { connect: [{ id: 4 }] } },
  {
    id: 20,
    name: 'электромагнитный клапан',
    equipmentKnots: { connect: [{ id: 4 }] },
  },
  {
    id: 21,
    name: 'насос пневматический',
    equipmentKnots: { connect: [{ id: 4 }] },
  },

  // Установка компрессорная (id: 5)
  { id: 22, name: 'влагоуловитель', equipmentKnots: { connect: [{ id: 5 }] } },
  {
    id: 23,
    name: 'ремень компрессора',
    equipmentKnots: { connect: [{ id: 5 }] },
  },
  { id: 24, name: 'масло', equipmentKnots: { connect: [{ id: 5 }] } },
  { id: 25, name: 'магистраль', equipmentKnots: { connect: [{ id: 5 }] } },
  { id: 26, name: 'фильтр', equipmentKnots: { connect: [{ id: 5 }] } },
  {
    id: 27,
    name: 'поршневая группа',
    equipmentKnots: { connect: [{ id: 5 }] },
  },

  // Узел поста(бокс) (id: 6)
  { id: 28, name: 'копье пистолета', equipmentKnots: { connect: [{ id: 6 }] } },
  {
    id: 29,
    name: 'муфта поворотная 90градусов',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  { id: 30, name: 'освещение', equipmentKnots: { connect: [{ id: 6 }] } },
  {
    id: 31,
    name: 'форсунка пистолета',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  { id: 32, name: 'курок пистолета', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 33, name: 'копье щетки', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 34, name: 'держатель щетки', equipmentKnots: { connect: [{ id: 6 }] } },
  {
    id: 35,
    name: 'муфты(соединения)вращающиеся',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  {
    id: 36,
    name: 'рукава высококого давления',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  { id: 37, name: 'щетка насадка', equipmentKnots: { connect: [{ id: 6 }] } },
  {
    id: 38,
    name: 'поворотная консоль',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  {
    id: 39,
    name: 'держатель копий пистолета ВД',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  {
    id: 40,
    name: 'зажим для ковриков',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  { id: 41, name: 'светильники', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 42, name: 'щелевая насадка', equipmentKnots: { connect: [{ id: 6 }] } },
  {
    id: 43,
    name: 'основной пистолет',
    equipmentKnots: { connect: [{ id: 6 }] },
  },
  { id: 44, name: 'ворота', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 45, name: 'колчан', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 46, name: 'банеры', equipmentKnots: { connect: [{ id: 6 }] } },
  { id: 47, name: 'отстойник', equipmentKnots: { connect: [{ id: 6 }] } },

  // Терминал (id: 7)
  {
    id: 48,
    name: 'защита купюроприемника',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  {
    id: 49,
    name: 'выключатель кнопочный',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  {
    id: 50,
    name: 'Программируемый контроллер ОВЕН',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  { id: 51, name: 'Купюроприемник', equipmentKnots: { connect: [{ id: 7 }] } },
  {
    id: 52,
    name: 'прочие электрокомпоненты',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  {
    id: 53,
    name: 'Монетоприемник VN',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  { id: 54, name: 'Считыватель', equipmentKnots: { connect: [{ id: 7 }] } },
  { id: 55, name: 'Vendotek', equipmentKnots: { connect: [{ id: 7 }] } },
  { id: 56, name: 'Замок', equipmentKnots: { connect: [{ id: 7 }] } },
  { id: 57, name: 'Ошибка 301', equipmentKnots: { connect: [{ id: 7 }] } },
  {
    id: 58,
    name: 'Монетоприемник NRI 3',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  { id: 59, name: 'ПЛК ОВЕН', equipmentKnots: { connect: [{ id: 7 }] } },
  {
    id: 60,
    name: 'Обогреватель с встроенным вентилятором',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  {
    id: 61,
    name: 'Частотный преобразователь',
    equipmentKnots: { connect: [{ id: 7 }] },
  },
  {
    id: 62,
    name: 'Корпус терминала DS',
    equipmentKnots: { connect: [{ id: 7 }] },
  },

  // Система умягчения воды (id: 8)
  { id: 63, name: 'Колонна(колба)', equipmentKnots: { connect: [{ id: 8 }] } },
  { id: 64, name: 'Катионит', equipmentKnots: { connect: [{ id: 8 }] } },
  {
    id: 65,
    name: 'тест на жесткость',
    equipmentKnots: { connect: [{ id: 8 }] },
  },
  { id: 66, name: 'Емкость солевая', equipmentKnots: { connect: [{ id: 8 }] } },
  {
    id: 67,
    name: 'Клапан распределения потоков',
    equipmentKnots: { connect: [{ id: 8 }] },
  },

  // Системы видеонаблюдения (id: 9)
  { id: 68, name: 'Камеры', equipmentKnots: { connect: [{ id: 9 }] } },

  // Рукомойник (id: 10)
  {
    id: 69,
    name: 'Корпус рукомойника D&S',
    equipmentKnots: { connect: [{ id: 10 }] },
  },
  { id: 70, name: 'Педаль-кран', equipmentKnots: { connect: [{ id: 10 }] } },
  { id: 71, name: 'Прочее', equipmentKnots: { connect: [{ id: 10 }] } },

  // Робот (id: 11)
  {
    id: 72,
    name: 'Оптический датчик',
    equipmentKnots: { connect: [{ id: 11 }] },
  },
  { id: 73, name: 'Редуктор', equipmentKnots: { connect: [{ id: 11 }] } },
  {
    id: 74,
    name: 'Датчик мойки дна',
    equipmentKnots: { connect: [{ id: 11 }] },
  },
  {
    id: 75,
    name: 'Датчик индукционный',
    equipmentKnots: { connect: [{ id: 11 }] },
  },

  // Пылесос (id: 12)
  { id: 76, name: 'Монетоприемник', equipmentKnots: { connect: [{ id: 12 }] } },
  { id: 77, name: 'Турбина', equipmentKnots: { connect: [{ id: 12 }] } },
  {
    id: 78,
    name: 'Консоль-шланг-насадка',
    equipmentKnots: { connect: [{ id: 12 }] },
  },
  {
    id: 79,
    name: 'Кнопка старт стоп',
    equipmentKnots: { connect: [{ id: 12 }] },
  },
  {
    id: 80,
    name: 'Дисплей информационный,ОВЕН',
    equipmentKnots: { connect: [{ id: 12 }] },
  },
  { id: 81, name: 'Блок питания', equipmentKnots: { connect: [{ id: 12 }] } },
  {
    id: 82,
    name: 'Мешок фильтровальный',
    equipmentKnots: { connect: [{ id: 12 }] },
  },
  { id: 83, name: 'ПЛК,ОВЕН', equipmentKnots: { connect: [{ id: 12 }] } },
  { id: 84, name: 'Колено', equipmentKnots: { connect: [{ id: 12 }] } },

  // Отчетность (id: 13)
  {
    id: 85,
    name: 'Отправка заявки по химии',
    equipmentKnots: { connect: [{ id: 13 }] },
  },
  {
    id: 86,
    name: 'Заполнение журнала поломок',
    equipmentKnots: { connect: [{ id: 13 }] },
  },
  {
    id: 87,
    name: 'Отчет о работе региональному менеджеру',
    equipmentKnots: { connect: [{ id: 13 }] },
  },

  // Котельное оборудование (id: 14)
  { id: 88, name: 'дымоход', equipmentKnots: { connect: [{ id: 14 }] } },
  { id: 89, name: 'бойлер', equipmentKnots: { connect: [{ id: 14 }] } },
  { id: 90, name: 'прибор учета', equipmentKnots: { connect: [{ id: 14 }] } },
  { id: 91, name: 'емкость ДТ', equipmentKnots: { connect: [{ id: 14 }] } },
  {
    id: 92,
    name: 'гидроаккумулятор',
    equipmentKnots: { connect: [{ id: 14 }] },
  },
  { id: 93, name: 'котел', equipmentKnots: { connect: [{ id: 14 }] } },
  { id: 94, name: 'теплообменник', equipmentKnots: { connect: [{ id: 14 }] } },
  { id: 95, name: 'горелка', equipmentKnots: { connect: [{ id: 14 }] } },

  // Короб.крыша (id: 15)
  { id: 96, name: 'ниппель', equipmentKnots: { connect: [{ id: 15 }] } },
  { id: 97, name: 'BSP адаптер', equipmentKnots: { connect: [{ id: 15 }] } },
  { id: 98, name: 'фитинг цанга', equipmentKnots: { connect: [{ id: 15 }] } },
  { id: 99, name: 'коллектор', equipmentKnots: { connect: [{ id: 15 }] } },
  {
    id: 100,
    name: 'обратный клапан',
    equipmentKnots: { connect: [{ id: 15 }] },
  },
  // Инжекторный модуль Premium 3G (id: 16)
  { id: 101, name: 'сервопривод', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 102, name: 'манометр', equipmentKnots: { connect: [{ id: 16 }] } },
  {
    id: 103,
    name: 'вышло из строя зелео',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  { id: 104, name: 'Клапан НД', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 105, name: 'Клапан ВД', equipmentKnots: { connect: [{ id: 16 }] } },
  {
    id: 106,
    name: 'манометр воздух',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 107,
    name: 'рукава высококого давления',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  { id: 108, name: 'магистраль 10', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 109, name: 'магистраль 6', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 110, name: 'инжектор', equipmentKnots: { connect: [{ id: 16 }] } },
  {
    id: 111,
    name: 'клапан электромагнитный химия',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 112,
    name: 'клапан электромагнитный воздух',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 113,
    name: 'клапан YSE-10Es',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 114,
    name: 'пневмораспределитель',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  { id: 115, name: 'реле давления', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 116, name: 'фильтр химии', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 117, name: 'регулятор ВД', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 118, name: 'регулятор НД', equipmentKnots: { connect: [{ id: 16 }] } },
  {
    id: 119,
    name: 'прочие гидрокомпоненты(пиши в примечании)',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 120,
    name: 'СПК с сенсорным управлением.ОВЕН',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 121,
    name: 'Модуль дискретного ввода',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 122,
    name: 'Преобразователь частоты ОВЕН',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 123,
    name: 'сброс ошибки ПЛК',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  { id: 124, name: 'ВИП-система', equipmentKnots: { connect: [{ id: 16 }] } },
  { id: 125, name: 'кран', equipmentKnots: { connect: [{ id: 16 }] } },
  {
    id: 126,
    name: 'коллектор низкого давления',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 127,
    name: 'плунжерный насос',
    equipmentKnots: { connect: [{ id: 16 }] },
  },
  {
    id: 128,
    name: 'электродвигатель',
    equipmentKnots: { connect: [{ id: 16 }] },
  },

  // Дозирующая установка Premium 4G (id: 17)
  { id: 129, name: 'сбросник', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 130,
    name: 'фильтр забора химии',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  { id: 131, name: 'коллектор', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 132,
    name: 'СПК с сенсорным управлением.ОВЕН',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  { id: 133, name: 'ПЛК', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 134,
    name: 'пневмораспределители',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  { id: 135, name: 'насос дозатор', equipmentKnots: { connect: [{ id: 17 }] } },
  { id: 136, name: 'помпа', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 137,
    name: 'электродвигатель',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  {
    id: 138,
    name: 'электромагнитный клапан ВД',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  { id: 139, name: 'WEEP система', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 140,
    name: 'электромагнитный клапан НД',
    equipmentKnots: { connect: [{ id: 17 }] },
  },
  { id: 141, name: 'манометр ВД', equipmentKnots: { connect: [{ id: 17 }] } },
  { id: 142, name: 'кран шаровый', equipmentKnots: { connect: [{ id: 17 }] } },
  {
    id: 143,
    name: 'регулятор давления',
    equipmentKnots: { connect: [{ id: 17 }] },
  },

  // Дозирующая установка Buisness (id: 18)
  { id: 144, name: 'фитинг цанга', equipmentKnots: { connect: [{ id: 18 }] } },
  {
    id: 145,
    name: 'клапан электромагнитный химия',
    equipmentKnots: { connect: [{ id: 18 }] },
  },
  { id: 146, name: 'насос дозатор', equipmentKnots: { connect: [{ id: 18 }] } },
  {
    id: 147,
    name: 'клапан редукционный',
    equipmentKnots: { connect: [{ id: 18 }] },
  },
  { id: 148, name: 'фильтр химии', equipmentKnots: { connect: [{ id: 18 }] } },

  // Водоснабжение АМС (id: 19)
  {
    id: 149,
    name: 'насос повышения давления',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  {
    id: 150,
    name: 'аксессуары к насосу',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  {
    id: 151,
    name: 'фильтр очистки',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  {
    id: 152,
    name: 'гидроаккумулятор',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  {
    id: 153,
    name: 'выход городской воды',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  { id: 154, name: 'Sirio', equipmentKnots: { connect: [{ id: 19 }] } },
  {
    id: 155,
    name: 'насос скважиный',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  {
    id: 156,
    name: 'накопительная емкость',
    equipmentKnots: { connect: [{ id: 19 }] },
  },
  { id: 157, name: 'трубы', equipmentKnots: { connect: [{ id: 19 }] } },
  { id: 158, name: 'счетчики', equipmentKnots: { connect: [{ id: 19 }] } },
  {
    id: 159,
    name: 'клапан соленоидный',
    equipmentKnots: { connect: [{ id: 19 }] },
  },

  // АХО(хоз.деятельность) (id: 20)
  { id: 160, name: 'помещения', equipmentKnots: { connect: [{ id: 20 }] } },
  { id: 161, name: 'территория', equipmentKnots: { connect: [{ id: 20 }] } },
  {
    id: 162,
    name: 'конструкция АМС',
    equipmentKnots: { connect: [{ id: 20 }] },
  },
  {
    id: 163,
    name: 'ремонт унитаза',
    equipmentKnots: { connect: [{ id: 20 }] },
  },

  // Америка Q1 (id: 21)
  { id: 164, name: 'помпа', equipmentKnots: { connect: [{ id: 21 }] } },
  { id: 165, name: 'регулятор НД', equipmentKnots: { connect: [{ id: 21 }] } },
  {
    id: 166,
    name: 'регулятор воздух',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  { id: 167, name: 'регулятор ВД', equipmentKnots: { connect: [{ id: 21 }] } },
  { id: 168, name: 'жиклер', equipmentKnots: { connect: [{ id: 21 }] } },
  {
    id: 169,
    name: 'фильтр в баке смешивания',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 170,
    name: 'металлический бак установки',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 171,
    name: 'обратный клапан',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 172,
    name: 'подводящий шланг',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 173,
    name: 'электромагнитный клапан воздух',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 174,
    name: 'электромагнитный клапан химия',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  { id: 175, name: 'флоджет', equipmentKnots: { connect: [{ id: 21 }] } },
  {
    id: 176,
    name: 'гидроконтроллер',
    equipmentKnots: { connect: [{ id: 21 }] },
  },
  {
    id: 177,
    name: 'галетный переключатель',
    equipmentKnots: { connect: [{ id: 21 }] },
  },

  // IT сеть (id: 22)
  { id: 178, name: 'Роутер', equipmentKnots: { connect: [{ id: 22 }] } },
  {
    id: 179,
    name: 'нет соединения/низкая скорость',
    equipmentKnots: { connect: [{ id: 22 }] },
  },
  { id: 180, name: 'витая пара', equipmentKnots: { connect: [{ id: 22 }] } },
  { id: 181, name: 'Коммутатор', equipmentKnots: { connect: [{ id: 22 }] } },
];
