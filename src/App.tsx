import { useEffect, useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import './App.css'

export type CultureEvent = {
  id: string
  title: string
  type: 'music' | 'art'
  city: 'tokyo' | 'kyoto'
  venue: string
  start: string
  end: string
  url: string
  source: string
  artists?: string[]
  notes?: string
}

type ArtistSeed = {
  makiImport?: { status?: string; instruction?: string }
  core?: { id: string; name: string }[]
}

type TypeFilter = 'all' | 'music' | 'art'
type CityFilter = 'all' | 'tokyo' | 'kyoto'

function overlapsDay(event: CultureEvent, day: Date) {
  const start = parseISO(event.start)
  const end = parseISO(event.end || event.start)
  return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end)
}

export default function App() {
  const [events, setEvents] = useState<CultureEvent[]>([])
  const [artistSeed, setArtistSeed] = useState<ArtistSeed | null>(null)
  const [cursor, setCursor] = useState(() => startOfMonth(new Date(2026, 8, 1)))
  const [type, setType] = useState<TypeFilter>('all')
  const [city, setCity] = useState<CityFilter>('all')
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 8, 10))

  useEffect(() => {
    fetch('/events.json')
      .then((r) => r.json())
      .then((data: CultureEvent[]) => setEvents(data))
      .catch(() => setEvents([]))
    fetch('/artists.json')
      .then((r) => r.json())
      .then((data: ArtistSeed) => setArtistSeed(data))
      .catch(() => setArtistSeed(null))
  }, [])

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (type !== 'all' && e.type !== type) return false
        if (city !== 'all' && e.city !== city) return false
        return true
      }),
    [events, type, city],
  )

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const dayEvents = useMemo(() => {
    if (!selected) return []
    return filtered
      .filter((e) => overlapsDay(e, selected))
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [filtered, selected])

  const upcoming = useMemo(
    () =>
      [...filtered]
        .filter((e) => parseISO(e.end) >= new Date(2026, 8, 10))
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 12),
    [filtered],
  )

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Kyoto ↔ Tokyo</p>
        <h1>Culture Calendar</h1>
        <p className="lede">音楽と美術だけを、静かに並べる。</p>
        {artistSeed?.makiImport?.status === 'missing' ? (
          <p className="seed-note">
            音楽はアーティスト起点。MAKIリスト未取り込み（いま core:{" "}
            {(artistSeed.core ?? []).map((a) => a.name).join(", ") || "なし"}）。
          </p>
        ) : null}
      </header>

      <section className="filters" aria-label="フィルター">
        <div className="seg">
          {([
            ['all', 'すべて'],
            ['music', '音楽'],
            ['art', '美術'],
          ] as const).map(([v, label]) => (
            <button key={v} className={type === v ? 'on' : ''} onClick={() => setType(v)}>
              {label}
            </button>
          ))}
        </div>
        <div className="seg">
          {([
            ['all', '両都市'],
            ['tokyo', '東京'],
            ['kyoto', '京都'],
          ] as const).map(([v, label]) => (
            <button key={v} className={city === v ? 'on' : ''} onClick={() => setCity(v)}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="calendar-wrap">
        <div className="month-nav">
          <button onClick={() => setCursor((c) => addMonths(c, -1))} aria-label="前月">
            ‹
          </button>
          <h2>{format(cursor, 'yyyy年 M月', { locale: ja })}</h2>
          <button onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="翌月">
            ›
          </button>
        </div>

        <div className="dow">
          {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid">
          {days.map((day) => {
            const marks = filtered.filter((e) => overlapsDay(e, day))
            const inMonth = isSameMonth(day, cursor)
            const isSelected = selected && isSameDay(day, selected)
            return (
              <button
                key={day.toISOString()}
                className={[
                  'cell',
                  inMonth ? '' : 'muted',
                  isSelected ? 'selected' : '',
                  marks.length ? 'has' : '',
                ].join(' ')}
                onClick={() => setSelected(day)}
              >
                <span className="num">{format(day, 'd')}</span>
                <span className="dots">
                  {marks.slice(0, 3).map((m) => (
                    <i key={m.id} className={m.type} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <h3>
          {selected ? format(selected, 'M月d日（E）', { locale: ja }) : '日付を選択'}
        </h3>
        {dayEvents.length === 0 ? (
          <p className="empty">この日の予定はまだない。</p>
        ) : (
          <ul className="list">
            {dayEvents.map((e) => (
              <li key={e.id}>
                <a href={e.url} target="_blank" rel="noreferrer">
                  <span className={`tag ${e.type}`}>{e.type === 'music' ? '音楽' : '美術'}</span>
                  <span className="city">{e.city === 'tokyo' ? '東京' : '京都'}</span>
                  <strong>{e.title}</strong>
                  <em>{e.venue}</em>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel upcoming">
        <h3>これから</h3>
        <ul className="list">
          {upcoming.map((e) => (
            <li key={e.id}>
              <a href={e.url} target="_blank" rel="noreferrer">
                <time>{e.start === e.end ? e.start : `${e.start} → ${e.end}`}</time>
                <span className={`tag ${e.type}`}>{e.type === 'music' ? '音楽' : '美術'}</span>
                <strong>{e.title}</strong>
                <em>
                  {e.city === 'tokyo' ? '東京' : '京都'} / {e.venue}
                </em>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <p>Notion にはこのページのURLを貼る。</p>
        <p className="sources">
          美術: Tokyo Art Beat ほか / 音楽: LIVENEX・LiveScopra・公式
        </p>
      </footer>
    </div>
  )
}
