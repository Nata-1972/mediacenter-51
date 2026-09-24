import type { Material } from './types'

export const initialMaterials: Material[] = [
  { id: 1, title: 'Герои нашего комплекса', category: 'Люди', format: 'Интервью', channel: 'Сайт', date: '24 сен', time: '15:00', owner: 'Анна Соколова', initials: 'АС', status: 'В работе', priority: 'Высокий', progress: 62 },
  { id: 2, title: 'Подкаст о Южном', category: 'Южный', format: 'Подкаст', channel: 'VK · Подкаст', date: '25 сен', time: '17:30', owner: 'Илья Ветров', initials: 'ИВ', status: 'На согласовании', priority: 'Средний', progress: 90 },
  { id: 3, title: 'День учителя', category: 'События', format: 'Видеоролик', channel: 'VK · ТВ', date: '3 окт', time: '12:00', owner: 'София Миронова', initials: 'СМ', status: 'Запланировано', priority: 'Высокий', progress: 25 },
  { id: 4, title: 'Новости недели', category: 'Новости', format: 'Дайджест', channel: 'Все каналы', date: '26 сен', time: '14:00', owner: 'Максим Орлов', initials: 'МО', status: 'В работе', priority: 'Обычный', progress: 48 },
  { id: 5, title: 'Интервью с педагогом', category: 'Люди', format: 'Интервью', channel: 'Сайт · VK', date: '29 сен', time: '16:00', owner: 'Дарья Белова', initials: 'ДБ', status: 'Идея', priority: 'Обычный', progress: 10 },
  { id: 6, title: 'Телевыпуск к памятной дате ЛНР', category: 'Память', format: 'Телевыпуск', channel: 'ТВ · VK', date: '30 сен', time: '10:00', owner: 'Никита Левин', initials: 'НЛ', status: 'На согласовании', priority: 'Высокий', progress: 85 },
  { id: 7, title: 'Достижения учащихся', category: 'Гордость 51', format: 'Карточки', channel: 'VK', date: '2 окт', time: '18:00', owner: 'Полина Романова', initials: 'ПР', status: 'Готово', priority: 'Средний', progress: 100 },
  { id: 8, title: 'Истории жителей квартала', category: 'Южный', format: 'Фоторепортаж', channel: 'Сайт · VK', date: '7 окт', time: '13:00', owner: 'Артём Волков', initials: 'АВ', status: 'Идея', priority: 'Обычный', progress: 5 },
  { id: 9, title: 'Школьный спортивный день', category: 'Спорт', format: 'Репортаж', channel: 'VK', date: '20 сен', time: '18:00', owner: 'Дарья Белова', initials: 'ДБ', status: 'Опубликовано', priority: 'Обычный', progress: 100 },
]

export const team = [
  { name: 'Анна Соколова', role: 'Редактор', className: '10А', initials: 'АС', color: '#e7eef9', done: 18 },
  { name: 'Илья Ветров', role: 'Ведущий · корреспондент', className: '9Б', initials: 'ИВ', color: '#e9f5f2', done: 12 },
  { name: 'София Миронова', role: 'Оператор', className: '11А', initials: 'СМ', color: '#f8ecec', done: 21 },
  { name: 'Максим Орлов', role: 'Монтажёр', className: '10Б', initials: 'МО', color: '#f5f0e6', done: 16 },
  { name: 'Дарья Белова', role: 'Корреспондент', className: '8А', initials: 'ДБ', color: '#eeeafb', done: 9 },
  { name: 'Полина Романова', role: 'SMM-специалист', className: '9А', initials: 'ПР', color: '#e7f3f8', done: 14 },
]

export const partners = [
  { name: 'Библиотека квартала Южный', type: 'Культура', projects: 3, initials: 'БЮ' },
  { name: 'Совет ветеранов', type: 'Общественная организация', projects: 2, initials: 'СВ' },
  { name: 'Дом творчества «Радуга»', type: 'Дополнительное образование', projects: 4, initials: 'РД' },
]
