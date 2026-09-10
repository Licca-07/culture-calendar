# Culture Calendar

京都⇄東京の **音楽 + 美術** イベントカレンダーWebアプリ。  
Notion にはこのアプリのURLを貼るだけでよい。

## データソース方針

詳細は [`SOURCES.md`](./SOURCES.md)。

| 分野 | 本線 |
|------|------|
| 美術 | **Tokyo Art Beat** |
| 音楽 | **MAKI由来の core artists → related**（LIVENEX/公式は検索補完） |

v1 は自動スクレイピングせず、`public/events.json` を更新して公開する。

## 開発

```bash
npm install
npm run dev
```

## Notion への載せ方

1. Vercel 等にデプロイして公開URLを得る
2. Notion ページにそのURLを貼る（ブックマーク／埋め込み）
3. 予定の更新は `public/events.json` を編集 → 再デプロイ

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
  "source": "livenex",
  "notes": ""
}
```

`type`: `music` | `art`  
`city`: `tokyo` | `kyoto`
