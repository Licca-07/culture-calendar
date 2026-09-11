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
import { enUS, ja } from 'date-fns/locale'
import './App.css'

export type CultureEvent = {
  id: string
  title: string
  type: 'music' | 'art' | 'fashion'
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

type TypeFilter = 'all' | 'music' | 'art' | 'fashion'
type CityFilter = 'all' | 'tokyo' | 'kyoto'

const typeLabel: Record<CultureEvent['type'], string> = {
  music: '音楽',
  art: '美術',
  fashion: 'ファッション',
}

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
  const [today] = useState(() => new Date())

  useEffect(() => {
    fetch('./events.json')
      .then((r) => r.json())
      .then((data: CultureEvent[]) => setEvents(data))
      .catch(() => setEvents([]))
    fetch('./artists.json')
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
        .slice(0, 16),
    [filtered],
  )

  const editionDate = selected ?? today
  const enDate = format(editionDate, 'MMMM d, yyyy', { locale: enUS })
  const jaDate = format(editionDate, 'yyyy年M月d日（E）', { locale: ja })
  const weekLabel = format(editionDate, 'EEEE', { locale: enUS }).toUpperCase()

  return (
    <div className="page">
      <header className="masthead">
        <div className="rule-double" aria-hidden="true" />
        <p className="issue-line">
          <span>VOL. 1</span>
          <span aria-hidden="true">·</span>
          <span>WEEKDAY EDITION</span>
          <span aria-hidden="true">·</span>
          <span>KYOTO ↔ TOKYO</span>
        </p>
        <h1 className="brand">Culture Calendar</h1>
        <div className="rule-double" aria-hidden="true" />
        <div className="dateline">
          <p className="dateline-en">
            {enDate} <span className="sep">—</span> MORNING EDITION <span className="sep">—</span>{' '}
            {weekLabel}
          </p>
          <p className="dateline-ja">{jaDate}</p>
        </div>
        <div className="meta-bar" aria-label="デスク">
          <span>音楽 · 美術 · ファッション</span>
          <span className="vbar" aria-hidden="true" />
          <span>左：暦</span>
          <span className="vbar" aria-hidden="true" />
          <span>右：本日の欄</span>
        </div>
        <div className="rule-single" aria-hidden="true" />
      </header>

      {artistSeed?.makiImport?.status === 'missing' ? (
        <p className="seed-note">
          音楽はアーティスト起点。MAKIリスト未取り込み（いま core:{' '}
          {(artistSeed.core ?? []).map((a) => a.name).join(', ') || 'なし'}）。
        </p>
      ) : null}

      <section className="filters" aria-label="フィルター">
        <div className="seg" role="group" aria-label="ジャンル">
          {([
            ['all', 'すべて'],
            ['music', '音楽'],
            ['art', '美術'],
            ['fashion', 'ファッション'],
          ] as const).map(([v, label]) => (
            <button key={v} className={type === v ? 'on' : ''} onClick={() => setType(v)}>
              {label}
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="都市">
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

      <div className="layout">
        <aside className="calendar-wrap">
          <div className="section-kicker">CALENDAR DESK</div>
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
        </aside>

        <section className="events-col" aria-label="イベント">
          <div className="panel">
            <div className="section-kicker">TODAY&apos;S COLUMN</div>
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
                      <span className={`tag ${e.type}`}>{typeLabel[e.type]}</span>
                      <span className="city">{e.city === 'tokyo' ? '東京' : '京都'}</span>
                      <strong>{e.title}</strong>
                      <em>{e.venue}</em>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel upcoming">
            <div className="section-kicker">FORTHCOMING</div>
            <h3>これから</h3>
            <ul className="list">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <a href={e.url} target="_blank" rel="noreferrer">
                    <time>{e.start === e.end ? e.start : `${e.start} → ${e.end}`}</time>
                    <span className={`tag ${e.type}`}>{typeLabel[e.type]}</span>
                    <strong>{e.title}</strong>
                    <em>
                      {e.city === 'tokyo' ? '東京' : '京都'} / {e.venue}
                    </em>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <footer className="colophon">
        <div className="rule-single" aria-hidden="true" />
        <p>Printed for the quiet hours · Music · Art · Fashion</p>
      </footer>
    </div>
  )
}
