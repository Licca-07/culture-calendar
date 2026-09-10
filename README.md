# Culture Calendar

京都⇄東京の **音楽 + 美術** イベントカレンダー（公開Webアプリ）。  
Notion にはこのサイトのURLを貼るだけ。

**更新頻度: 月1回**（`docs/UPDATE_CADENCE.md`）

## データソース

詳細は [`SOURCES.md`](./SOURCES.md) / [`docs/MUSIC_ARTISTS.md`](./docs/MUSIC_ARTISTS.md)。

| 分野 | 本線 |
|------|------|
| 美術 | **Tokyo Art Beat** |
| 音楽 | **MAKI由来の core artists → related**（LIVENEX/公式は検索補完） |

データは `public/events.json` / `public/artists.json`。

## 開発

```bash
npm install
npm run dev
```

## デプロイ（Vercel）

- GitHub `main` に push → Vercel が自動ビルド・公開
- フレームワーク: Vite
- ビルド: `npm run build` / 出力: `dist`

## Notion

1. 公開URLをコピー
2. Notion にブックマーク／埋め込みで貼る
3. 月次更新後も同じURLのまま

## イベント追加

`public/events.json` にオブジェクトを足す。

```json
{
  "id": "unique-id",
  "title": "イベント名",
  "type": "music",
  "city": "tokyo",
  "venue": "会場",
  "start": "2026-10-01",
  "end": "2026-10-01",
  "url": "https://...",
  "source": "official",
  "artists": ["halley"],
  "notes": ""
}
```

`type`: `music` | `art`  
`city`: `tokyo` | `kyoto`
