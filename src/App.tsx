import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  Activity, Archive, BarChart3, Bell, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleAlert, Clock3, FileAudio, FileText, Film, FolderLock, Handshake,
  Image, KanbanSquare, LayoutDashboard, LockKeyhole, Menu, MessageCircle, Mic2, MoreHorizontal,
  Newspaper, Paperclip, Play, Plus, Radio, Search, Send, Settings, ShieldCheck, Sparkles,
  Star, Target, Users, Video, X,
} from 'lucide-react'
import { initialMaterials, partners, team } from './data'
import type { Material, Status, Toast } from './types'

const nav = [
  ['Главная', LayoutDashboard], ['Контент-план', CalendarDays], ['Редакционная доска', KanbanSquare],
  ['Планёрки', Users], ['Медиатека', Archive], ['Обратная связь', MessageCircle],
  ['Команда', Users], ['Аналитика', BarChart3], ['Партнёры Южного', Handshake],
] as const

const statusClass: Record<Status, string> = {
  'Идея': 'idea', 'Запланировано': 'planned', 'В работе': 'working', 'На согласовании': 'review',
  'Готово': 'ready', 'Опубликовано': 'published', 'Требуется доработка': 'revision',
}

const sectionMeta: Record<string, [string, string]> = {
  'Контент-план': ['Контент-план', 'Управляйте ритмом публикаций по всем каналам'],
  'Редакционная доска': ['Редакционная доска', 'Материалы от идеи до публикации'],
  'Планёрки': ['Редакционные планёрки', 'Решения, задачи и ответственность команды'],
  'Медиатека': ['Медиатека', 'Безопасное хранилище материалов редакции'],
  'Обратная связь': ['Голос Южного', 'Отзывы, вопросы и темы от семей и жителей'],
  'Команда': ['Команда медиацентра', 'Роли, задачи и достижения участников'],
  'Аналитика': ['Аналитика', 'Ритм работы и влияние медиацентра'],
  'Партнёры Южного': ['Партнёры квартала Южный', 'Сотрудничество, события и общие медиапроекты'],
}

function App() {
  const [active, setActive] = useState('Главная')
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<'material' | 'idea' | 'meeting' | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [materials, setMaterials] = useState<Material[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc51-materials') || '') || initialMaterials } catch { return initialMaterials }
  })

  useEffect(() => localStorage.setItem('mc51-materials', JSON.stringify(materials)), [materials])

  const notify = (text: string) => {
    const id = Date.now()
    setToasts((items) => [...items, { id, text }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200)
  }

  const navigate = (label: string) => { setActive(label); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const moveMaterial = (id: number, status: Status) => setMaterials((items) => items.map((m) => m.id === id ? { ...m, status } : m))

  return (
    <div className="app-shell">
      <Sidebar active={active} open={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
      <main className="main">
        <Header onMenu={() => setMenuOpen(true)} onNavigate={navigate} notify={notify} />
        {active === 'Главная'
          ? <Dashboard materials={materials} onNavigate={navigate} onOpen={setModal} />
          : <SectionPage active={active} materials={materials} moveMaterial={moveMaterial} onOpen={setModal} notify={notify} />}
      </main>
      {modal && <ActionModal type={modal} onClose={() => setModal(null)} notify={notify} onCreate={(material) => setMaterials((m) => [material, ...m])} />}
      <div className="toast-stack" aria-live="polite">{toasts.map((t) => <div className="toast" key={t.id}><Check size={17} />{t.text}</div>)}</div>
    </div>
  )
}

function Sidebar({ active, open, onNavigate, onClose }: { active: string; open: boolean; onNavigate: (s: string) => void; onClose: () => void }) {
  return <>
    <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><span>51</span><Radio size={15} /></div>
        <div><strong>МЕДИАЦЕНТР</strong><small>ЛУВК · ЮЖНЫЙ</small></div>
        <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Закрыть меню"><X /></button>
      </div>
      <div className="live"><i /> Редакция в эфире <span>12 участников</span></div>
      <nav aria-label="Основная навигация">
        {nav.map(([label, Icon]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => onNavigate(label)}><Icon size={19} /><span>{label}</span>{label === 'Обратная связь' && <b>8</b>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <button><ShieldCheck size={19} /><span>Безопасность</span></button>
        <button><Settings size={19} /><span>Настройки</span></button>
        <div className="user-card"><Avatar initials="ЕК" /><div><strong>Елена Кравцова</strong><span>Куратор медиацентра</span></div><MoreHorizontal size={18} /></div>
      </div>
    </aside>
  </>
}

function Header({ onMenu, onNavigate, notify }: { onMenu: () => void; onNavigate: (s: string) => void; notify: (s: string) => void }) {
  return <header className="topbar">
    <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Открыть меню"><Menu /></button>
    <div className="search"><Search size={18} /><input aria-label="Поиск" placeholder="Найти материал, задачу или участника..." /><kbd>⌘ K</kbd></div>
    <div className="top-actions">
      <button className="security-pill" onClick={() => notify('Все данные защищены')}><LockKeyhole size={15} /> Защищённый режим</button>
      <button className="icon-btn notification" onClick={() => notify('У вас 3 новых уведомления')} aria-label="Уведомления"><Bell /><i>3</i></button>
      <button className="avatar-button" onClick={() => onNavigate('Команда')}><Avatar initials="ЕК" /></button>
    </div>
  </header>
}

function Dashboard({ materials, onNavigate, onOpen }: { materials: Material[]; onNavigate: (s: string) => void; onOpen: (m: 'material' | 'idea' | 'meeting') => void }) {
  return <div className="page dashboard">
    <section className="welcome">
      <div><div className="eyebrow"><span>ЧЕТВЕРГ</span> · 24 СЕНТЯБРЯ</div><h1>Доброе утро, редакция!</h1><p>Сегодня в фокусе: 5 задач, 2 согласования и планёрка в 15:30.</p></div>
      <div className="weather"><span>ЛУГАНСК</span><strong>18°</strong><small>Ясно · отличный день для съёмок</small></div>
    </section>
    <section className="quick-actions">
      <button className="action-primary" onClick={() => onOpen('material')}><Plus /> <span><strong>Создать материал</strong><small>Новая публикация</small></span></button>
      <button onClick={() => onOpen('idea')}><Sparkles /> <span><strong>Предложить тему</strong><small>Добавить идею</small></span></button>
      <button onClick={() => onOpen('meeting')}><Video /> <span><strong>Начать планёрку</strong><small>Сегодня, 15:30</small></span></button>
    </section>
    <section className="metrics-grid">
      <Metric icon={<Newspaper />} value="24" label="публикации в сентябре" trend="+18%" tone="blue" />
      <Metric icon={<Check />} value="86%" label="задач выполнено в срок" trend="+7%" tone="green" />
      <Metric icon={<Users />} value="18" label="активных участников" trend="+3" tone="violet" />
      <Metric icon={<Target />} value="73%" label="родителей в охвате" trend="Цель 70%" tone="red" />
    </section>
    <div className="dashboard-grid">
      <section className="panel schedule-panel">
        <PanelTitle title="Ближайшие публикации" subtitle="Расписание редакции" action="Весь контент-план" onAction={() => onNavigate('Контент-план')} />
        <div className="publication-list">{materials.filter(m => m.status !== 'Идея').slice(0, 4).map((m, i) => <Publication key={m.id} item={m} first={i === 0} />)}</div>
      </section>
      <section className="panel tasks-panel">
        <PanelTitle title="Мои задачи" subtitle="5 активных · 1 просрочена" action="Все задачи" onAction={() => onNavigate('Редакционная доска')} />
        <Task checked title="Проверить сценарий подкаста" meta="Сегодня · Подкаст о Южном" owner="ИВ" />
        <Task title="Согласовать видеоряд" meta="Сегодня, 14:00 · День учителя" owner="СМ" />
        <Task title="Подготовить вопросы для интервью" meta="Завтра · Герои комплекса" owner="АС" />
        <Task title="Опубликовать дайджест" meta="Просрочено на 1 день" owner="ПР" alert />
      </section>
      <WeekCalendar materials={materials} />
      <section className="panel approval-panel">
        <PanelTitle title="На согласовании" subtitle="Требуют вашего решения" action="Смотреть все" onAction={() => onNavigate('Редакционная доска')} />
        {materials.filter(m => m.status === 'На согласовании').map(m => <div className="approval" key={m.id}><div className="approval-thumb"><Play size={18} /></div><div><strong>{m.title}</strong><span>{m.format} · {m.owner}</span><div className="approval-actions"><button><Check size={14} /> Согласовать</button><button><MessageCircle size={14} /></button></div></div></div>)}
      </section>
      <section className="panel activity-panel">
        <PanelTitle title="Пульс редакции" subtitle="Последние события" />
        <ActivityItem initials="ПР" text={<><b>Полина</b> опубликовала «Достижения учащихся»</>} time="12 мин" />
        <ActivityItem initials="ЕК" text={<><b>Елена Викторовна</b> согласовала телевыпуск</>} time="34 мин" />
        <ActivityItem initials="ИВ" text={<><b>Илья</b> загрузил новую версию аудио</>} time="1 ч" />
        <ActivityItem initials="АС" text={<><b>Анна</b> назначила 3 задачи команде</>} time="2 ч" />
      </section>
    </div>
  </div>
}

function SectionPage({ active, materials, moveMaterial, onOpen, notify }: { active: string; materials: Material[]; moveMaterial: (id: number, s: Status) => void; onOpen: (m: 'material' | 'idea' | 'meeting') => void; notify: (s: string) => void }) {
  const [title, subtitle] = sectionMeta[active]
  const action = active === 'Планёрки' ? () => onOpen('meeting') : active === 'Обратная связь' ? () => onOpen('idea') : active === 'Контент-план' || active === 'Редакционная доска' ? () => onOpen('material') : undefined
  return <div className="page section-page">
    <section className="section-heading"><div><span className="eyebrow">ЦИФРОВОЙ ШТАБ · МЕДИАЦЕНТР 51</span><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="red-button" onClick={action}><Plus size={18} /> {active === 'Планёрки' ? 'Новая планёрка' : active === 'Обратная связь' ? 'Предложить тему' : 'Создать материал'}</button>}</section>
    {active === 'Контент-план' && <ContentPlan materials={materials} />}
    {active === 'Редакционная доска' && <Kanban materials={materials} moveMaterial={moveMaterial} />}
    {active === 'Планёрки' && <Meetings notify={notify} />}
    {active === 'Медиатека' && <MediaLibrary notify={notify} />}
    {active === 'Обратная связь' && <Feedback notify={notify} />}
    {active === 'Команда' && <Team />}
    {active === 'Аналитика' && <Analytics />}
    {active === 'Партнёры Южного' && <Partners notify={notify} />}
  </div>
}

function ContentPlan({ materials }: { materials: Material[] }) {
  const days = ['ПН\n21', 'ВТ\n22', 'СР\n23', 'ЧТ\n24', 'ПТ\n25', 'СБ\n26', 'ВС\n27']
  return <>
    <div className="toolbar"><div className="segmented"><button className="active">Неделя</button><button>Месяц</button></div><button className="filter"><CalendarDays size={17} /> 21–27 сентября <ChevronDown size={15} /></button><button className="filter">Все каналы <ChevronDown size={15} /></button><button className="filter">Все статусы <ChevronDown size={15} /></button></div>
    <div className="panel calendar-board">
      <div className="calendar-nav"><button className="icon-btn"><ChevronLeft /></button><strong>21–27 сентября 2026</strong><button className="icon-btn"><ChevronRight /></button><span /><i className="legend blue" /> Публикация <i className="legend red" /> Срок</div>
      <div className="week-grid">{days.map((d, i) => <div className={`week-day ${i === 3 ? 'today' : ''}`} key={d}><div className="day-title">{d.split('\n').map(x => <span key={x}>{x}</span>)}</div>{materials.slice(i, i + (i % 2 ? 2 : 1)).map(m => <div className={`calendar-card ${statusClass[m.status]}`} key={m.id}><span>{m.time}</span><strong>{m.title}</strong><small>{m.channel}</small><Avatar initials={m.initials} /></div>)}</div>)}</div>
    </div>
    <div className="plan-table panel"><div className="table-head"><span>Материал</span><span>Формат</span><span>Ответственный</span><span>Срок</span><span>Статус</span></div>{materials.slice(0, 6).map(m => <div className="table-row" key={m.id}><span><b>{m.title}</b><small>{m.category} · {m.channel}</small></span><span>{m.format}</span><span className="owner"><Avatar initials={m.initials} />{m.owner}</span><span>{m.date}, {m.time}</span><StatusPill status={m.status} /></div>)}</div>
  </>
}

function Kanban({ materials, moveMaterial }: { materials: Material[]; moveMaterial: (id: number, status: Status) => void }) {
  const columns: Status[] = ['Идея', 'Запланировано', 'В работе', 'На согласовании', 'Опубликовано']
  return <><div className="toolbar"><button className="filter"><Search size={17} /> Поиск по доске</button><button className="filter">Все форматы <ChevronDown size={15} /></button><button className="filter">Приоритет <ChevronDown size={15} /></button><span className="drag-hint">Перетащите карточку в нужную колонку</span></div>
    <div className="kanban">{columns.map(status => <div className="kanban-column" key={status} onDragOver={e => e.preventDefault()} onDrop={e => moveMaterial(Number(e.dataTransfer.getData('id')), status)}><div className="kanban-head"><span className={`dot ${statusClass[status]}`} /><strong>{status}</strong><b>{materials.filter(m => m.status === status).length}</b><Plus size={17} /></div>{materials.filter(m => m.status === status).map(m => <div className="kanban-card" draggable onDragStart={e => e.dataTransfer.setData('id', String(m.id))} key={m.id}><div className="card-labels"><span>{m.category}</span>{m.priority === 'Высокий' && <em>Важно</em>}</div><h3>{m.title}</h3><p><Clock3 size={14} /> {m.date} · {m.format}</p><div className="progress"><i style={{ width: `${m.progress}%` }} /></div><footer><Avatar initials={m.initials} /><span>{m.owner.split(' ')[0]}</span><Paperclip size={14} /><b>{m.id % 4 + 1}</b></footer></div>)}</div>)}</div></>
}

function Meetings({ notify }: { notify: (s: string) => void }) {
  return <div className="two-column-layout"><div><div className="meeting-feature"><div className="meeting-date"><b>24</b><span>СЕН</span></div><div><span className="live-badge">СЕГОДНЯ · 15:30</span><h2>Еженедельная редакционная планёрка</h2><p>Контент-план на неделю, День учителя и новый выпуск подкаста</p><div className="avatar-stack">{team.slice(0,5).map(x => <Avatar key={x.initials} initials={x.initials} />)}<b>+7</b></div></div><button className="red-button" onClick={() => notify('Планёрка запущена')}><Video size={17} /> Подключиться</button></div>
    <h3 className="subheading">Предстоящие</h3>{['Интервью: подготовка съёмки|28 сен · 14:20|6 участников','План выпуска ко Дню учителя|1 окт · 15:30|9 участников'].map(x => {const [a,b,c]=x.split('|'); return <div className="meeting-row" key={a}><CalendarDays /><div><strong>{a}</strong><span>{b} · {c}</span></div><button className="icon-btn"><MoreHorizontal /></button></div>})}</div>
    <div className="panel protocol"><span className="eyebrow">ПРОТОКОЛ № 18</span><h2>Итоги прошлой планёрки</h2><p>17 сентября 2026 · 42 минуты</p><h4>Принятые решения</h4>{['Запустить рубрику «Герои нашего комплекса»','Подготовить пилот подкаста о Южном','Обновить заставку телевизионного выпуска'].map((x,i)=><div className="decision" key={x}><Check /> <span>{x}<small>Ответственный: {team[i].name} · до {25+i} сентября</small></span></div>)}<button className="text-button">Открыть полный протокол <ChevronRight size={16}/></button></div></div>
}

function MediaLibrary({ notify }: { notify: (s: string) => void }) {
  const files = [
    ['День учителя — тизер.mp4','Видео · 148 МБ','video'], ['Подкаст_Южный_финал.mp3','Аудио · 42 МБ','audio'], ['Интервью_кадр_01.jpg','Фото · 8,4 МБ','image'], ['Сценарий выпуска №12.docx','Документ · 1,2 МБ','doc'],
    ['Фотографии спортдня','36 файлов · 286 МБ','folder'], ['Логотипы медиацентра','12 файлов · 34 МБ','folder'], ['Телевыпуск_11.mp4','Видео · 624 МБ','video'], ['Заставка_новая.mp4','Видео · 85 МБ','video'],
  ]
  return <><div className="toolbar"><div className="search large"><Search size={18}/><input placeholder="Поиск по названию, автору или тегу..." /></div><button className="filter">Все типы <ChevronDown size={15}/></button><button className="red-button" onClick={() => notify('Выберите файлы для загрузки')}><Plus size={17}/> Загрузить</button></div><div className="library-stats"><span><FolderLock/>Защищённое хранилище</span><b>18,4 ГБ <small>из 50 ГБ</small></b><i><em /></i></div><div className="file-grid">{files.map(([name,meta,type])=><div className="file-card" key={name}><div className={`file-preview ${type}`}>{type==='video'?<Play/>:type==='audio'?<FileAudio/>:type==='image'?<Image/>:type==='folder'?<Archive/>:<FileText/>}<button className="icon-btn"><MoreHorizontal/></button></div><strong>{name}</strong><span>{meta}</span><small>Анна Соколова · 23 сен</small></div>)}</div></>
}

function Feedback({ notify }: { notify: (s: string) => void }) {
  const entries = [
    ['Предложение темы','Истории учителей, которые работают в школе больше 20 лет','Марина, мама ученицы 7А','На рассмотрении'],
    ['Событие квартала','В субботу в библиотеке пройдёт встреча с краеведом','Александр Петрович, житель Южного','Принято'],
    ['Отзыв','Очень понравился выпуск о достижениях ребят. Спасибо команде!','Ольга, мама ученика 9Б','Опубликовано'],
  ]
  return <div className="two-column-layout feedback-layout"><div><div className="feedback-banner"><div><span className="eyebrow">ОТКРЫТАЯ РЕДАКЦИЯ</span><h2>Есть история, о которой стоит рассказать?</h2><p>Предлагайте героев, события и темы. Каждое обращение проходит безопасную модерацию.</p></div><MessageCircle /></div><div className="feedback-list">{entries.map(([type,title,author,status])=><div className="feedback-card" key={title}><div><span>{type}</span><StatusPill status={status === 'Опубликовано' ? 'Опубликовано' : status === 'Принято' ? 'Готово' : 'На согласовании'} /></div><h3>{title}</h3><p>{author} · 2 часа назад</p><footer><button onClick={() => notify('Обращение принято в работу')}>Принять в работу</button><button>Ответить</button></footer></div>)}</div></div><aside className="panel moderation"><ShieldCheck/><h2>Модерация</h2><strong>8</strong><span>новых обращений</span><div><b>5</b><small>предложений тем</small></div><div><b>2</b><small>отзыва</small></div><div><b>1</b><small>вопрос</small></div><button className="red-button" onClick={() => notify('Очередь модерации открыта')}>Открыть очередь</button><p><LockKeyhole size={14}/> Контактные данные доступны только куратору</p></aside></div>
}

function Team() {
  return <><div className="team-summary"><div><Users/><b>18</b><span>участников</span></div><div><Activity/><b>7</b><span>медиаролей</span></div><div><Star/><b>126</b><span>материалов создано</span></div><div><Sparkles/><b>9</b><span>достижений в этом месяце</span></div></div><div className="team-grid">{team.map((person,i)=><div className="member-card" key={person.name}><div className="member-cover" style={{background: person.color}}><Avatar initials={person.initials}/><span>{person.className}</span></div><h3>{person.name}</h3><p>{person.role}</p><div className="member-numbers"><span><b>{person.done}</b> материалов</span><span><b>{i%4+1}</b> задач</span></div><div className="skill-tags"><span>{i%2?'В кадре':'Текст'}</span><span>{i%3?'Монтаж':'Интервью'}</span></div><button>Открыть профиль</button></div>)}</div><div className="panel curator"><Avatar initials="ЕК"/><div><span className="eyebrow">КУРАТОР МЕДИАЦЕНТРА</span><h2>Елена Викторовна Кравцова</h2><p>Координирует редакцию, помогает осваивать новые роли и отвечает за безопасную публикацию материалов.</p></div><ShieldCheck/></div></>
}

function Analytics() {
  const bars = [42,58,48,72,64,86,78,93,70,82,95,88]
  return <><div className="analytics-top"><Metric icon={<Newspaper/>} value="24" label="публикации за месяц" trend="+18%" tone="blue"/><Metric icon={<Clock3/>} value="86%" label="выполнено в срок" trend="+7%" tone="green"/><Metric icon={<Activity/>} value="48,2К" label="просмотров" trend="+24%" tone="violet"/><Metric icon={<MessageCircle/>} value="132" label="реакции и отзывы" trend="+31%" tone="red"/></div><div className="analytics-grid"><div className="panel chart-panel"><PanelTitle title="Регулярность публикаций" subtitle="Последние 12 недель"/><div className="bar-chart">{bars.map((b,i)=><div key={i}><i style={{height:`${b}%`}}/><span>{i+1}</span></div>)}</div><div className="chart-footer"><b>В среднем 6,2</b> публикации в неделю <span>Цель: не менее 5</span></div></div><div className="panel reach-card"><span className="eyebrow">КЛЮЧЕВОЙ ОРИЕНТИР</span><div className="reach-ring"><strong>73<small>%</small></strong><span>родителей получают новости</span></div><h3>Цель 70% достигнута</h3><p>Рост на 8 п.п. с начала учебного года</p></div><div className="panel rubric-card"><PanelTitle title="Популярные рубрики" subtitle="По просмотрам и реакциям"/>{[['Гордость 51','12 480',92],['Новости комплекса','9 310',74],['Люди Южного','7 840',61],['Школьная жизнь','6 920',54]].map(([a,b,c])=><div className="rubric" key={a as string}><span>{a}</span><b>{b}</b><i><em style={{width:`${c}%`}}/></i></div>)}</div><div className="panel channel-card"><PanelTitle title="Каналы публикации" subtitle="Доля общего охвата"/>{[['ВКонтакте','48%'],['Сайт комплекса','26%'],['Родительские чаты','18%'],['Радио и ТВ','8%']].map((x,i)=><div className="channel" key={x[0]}><span style={{background:`hsl(${210+i*18} 65% ${38+i*6}%)`}}/><b>{x[0]}</b><strong>{x[1]}</strong></div>)}</div></div></>
}

function Partners({ notify }: { notify: (s: string) => void }) {
  return <><div className="partner-hero"><div><span className="eyebrow">КВАРТАЛ ЮЖНЫЙ · ЛУГАНСК</span><h2>Медиацентр объединяет тех, кто создаёт жизнь квартала</h2><p>Совместные истории, события и проекты помогают ученикам видеть свой район по-новому.</p></div><Handshake/></div><div className="partner-grid">{partners.map((p,i)=><div className="partner-card" key={p.name}><div className="partner-logo">{p.initials}</div><span>{p.type}</span><h3>{p.name}</h3><p>{p.projects} совместных проекта · {i+1} событие в плане</p><footer><div className="avatar-stack"><Avatar initials="ЕК"/><Avatar initials={team[i].initials}/></div><button onClick={() => notify(`Карточка «${p.name}» открыта`)}>Подробнее <ChevronRight size={15}/></button></footer></div>)}</div><div className="two-column-layout partner-bottom"><div className="panel events"><PanelTitle title="Календарь сотрудничества" subtitle="Ближайшие совместные события"/>{[['28 СЕН','Встреча с краеведом','Библиотека Южного'],['04 ОКТ','Съёмка истории ветерана','Совет ветеранов'],['12 ОКТ','Медиа-мастерская','Дом творчества «Радуга»']].map(x=><div className="event-row" key={x[1]}><b>{x[0]}</b><span><strong>{x[1]}</strong><small>{x[2]}</small></span><ChevronRight/></div>)}</div><div className="panel invite"><Sparkles/><h2>Стать партнёром</h2><p>Предложите совместное событие, героя или медиапроект для квартала Южный.</p><button className="red-button" onClick={() => notify('Форма партнёрства открыта')}>Предложить проект</button></div></div></>
}

function ActionModal({ type, onClose, notify, onCreate }: { type: 'material'|'idea'|'meeting'; onClose: () => void; notify: (s: string) => void; onCreate: (m: Material) => void }) {
  const titles = { material: 'Новый материал', idea: 'Предложить тему', meeting: 'Новая планёрка' }
  const [step, setStep] = useState(1)
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); if(type==='material') onCreate({ id:Date.now(), title:String(fd.get('title')||'Новый материал'), category:'Школьная жизнь', format:String(fd.get('format')||'Публикация'), channel:'Сайт · VK', date:'30 сен', time:'15:00', owner:'Елена Кравцова', initials:'ЕК', status:'Идея', priority:'Обычный', progress:5 }); notify(type==='material'?'Материал добавлен в контент-план':type==='idea'?'Тема отправлена на модерацию':'Планёрка добавлена в расписание'); onClose() }
  return <div className="modal-backdrop" onMouseDown={e => e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}><header><div><span className="eyebrow">МЕДИАЦЕНТР 51</span><h2>{titles[type]}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></header>{type==='material'&&<div className="steps">{['Идея','Планёрка','Производство','Согласование','Публикация'].map((x,i)=><span className={step===i+1?'active':''} key={x}><b>{i+1}</b>{x}</span>)}</div>}<div className="form-grid"><label className="full">{type==='meeting'?'Название планёрки':type==='idea'?'Тема предложения':'Заголовок'}<input name="title" required placeholder={type==='meeting'?'Еженедельная планёрка':type==='idea'?'О чём стоит рассказать?':'Название материала'}/></label><label>{type==='meeting'?'Дата и время':'Рубрика'}<input type={type==='meeting'?'datetime-local':'text'} placeholder="Школьная жизнь"/></label><label>{type==='meeting'?'Участники':'Формат'}<select name="format"><option>{type==='meeting'?'Вся редакция':'Статья'}</option><option>{type==='meeting'?'Рабочая группа':'Видеоролик'}</option><option>Подкаст</option><option>Фоторепортаж</option></select></label><label className="full">{type==='meeting'?'Повестка':'Описание'}<textarea rows={4} placeholder="Добавьте важные детали..."/></label>{type==='material'&&<><label>Канал публикации<select><option>Сайт · ВКонтакте</option><option>Радио</option><option>Телевидение</option><option>Подкаст</option></select></label><label>Целевая аудитория<select><option>Все участники комплекса</option><option>Родители</option><option>Жители квартала</option></select></label><label className="consent full"><input type="checkbox"/> Проверить согласия на публикацию изображений детей</label></>}</div><footer><span><ShieldCheck size={16}/> Данные доступны только участникам редакции</span><div><button type="button" className="cancel" onClick={onClose}>Отмена</button>{type==='material'&&step<5?<button type="button" className="red-button" onClick={()=>setStep(s=>s+1)}>Далее <ChevronRight size={17}/></button>:<button className="red-button" type="submit">{type==='idea'?'Отправить':type==='meeting'?'Создать':'Сохранить'}</button>}</div></footer></form></div>
}

function Metric({ icon, value, label, trend, tone }: { icon: ReactNode; value: string; label: string; trend: string; tone: string }) { return <article className={`metric ${tone}`}><div className="metric-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div><b>{trend}</b></article> }
function PanelTitle({ title, subtitle, action, onAction }: { title:string; subtitle:string; action?:string; onAction?:()=>void }) { return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action&&<button onClick={onAction}>{action}<ChevronRight size={16}/></button>}</div> }
function Avatar({ initials }: { initials: string }) { return <span className="avatar" aria-label={`Пользователь ${initials}`}>{initials}</span> }
function StatusPill({ status }: { status: Status }) { return <span className={`status ${statusClass[status]}`}><i/>{status}</span> }
function Publication({ item, first }: { item: Material; first?: boolean }) { return <div className={`publication ${first?'featured':''}`}><div className="pub-date"><b>{item.date.split(' ')[0]}</b><span>{item.date.split(' ')[1]}</span></div><div className="pub-main"><div><StatusPill status={item.status}/><span className="format">{item.format}</span></div><strong>{item.title}</strong><small>{item.time} · {item.channel}</small></div><div className="pub-owner"><Avatar initials={item.initials}/><span>{item.owner}</span></div><button className="icon-btn"><MoreHorizontal/></button></div> }
function Task({ title, meta, owner, alert, checked }: { title:string; meta:string; owner:string; alert?:boolean; checked?:boolean }) { const [done,setDone]=useState(checked||false); return <div className={`task ${alert?'alert':''} ${done?'done':''}`}><button className="check-button" onClick={()=>setDone(!done)}>{done&&<Check size={14}/>}</button><div><strong>{title}</strong><span>{alert&&<CircleAlert size={13}/>} {meta}</span></div><Avatar initials={owner}/></div> }
function WeekCalendar({ materials }: { materials: Material[] }) { return <section className="panel week-panel"><PanelTitle title="Неделя в редакции" subtitle="21–27 сентября" action="Открыть календарь"/><div className="mini-week">{['ПН 21','ВТ 22','СР 23','ЧТ 24','ПТ 25','СБ 26','ВС 27'].map((d,i)=><div className={i===3?'active':''} key={d}><span>{d.split(' ')[0]}</span><b>{d.split(' ')[1]}</b>{i!==1&&<i/>}{i===3&&<em>3</em>}</div>)}</div><div className="today-events"><span>15:30</span><i/><div><strong>Редакционная планёрка</strong><small>Кабинет медиацентра · 12 участников</small></div><button><Video size={16}/> Подключиться</button></div><div className="today-events"><span>17:00</span><i className="red"/><div><strong>{materials[1].title}: финальная запись</strong><small>Студия · {materials[1].owner}</small></div></div></section> }
function ActivityItem({ initials, text, time }: { initials:string; text:ReactNode; time:string }) { return <div className="activity-item"><Avatar initials={initials}/><p>{text}</p><span>{time}</span></div> }

export default App
