export type Status = 'Идея' | 'Запланировано' | 'В работе' | 'На согласовании' | 'Готово' | 'Опубликовано' | 'Требуется доработка'

export type Material = {
  id: number
  title: string
  category: string
  format: string
  channel: string
  date: string
  time: string
  owner: string
  initials: string
  status: Status
  priority: 'Высокий' | 'Средний' | 'Обычный'
  progress: number
}

export type Toast = { id: number; text: string }
