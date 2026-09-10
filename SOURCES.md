# Culture Calendar — データソース方針

Notion にはこのWebアプリのURLを貼るだけ。収集は別レイヤー。

## 美術 → Tokyo Art Beat（本線）

- サイト: https://www.tokyoartbeat.com/
- 強み: 展覧会の網羅性が高く、mei型の美術導線に合う
- 注意: かつての公開APIは現状あてにしない。v1は **週次で人手／Cursorが拾って JSON に入れる**
- 京都も TAB や公式館サイトで補完

## 音楽 → 用途で分ける（TABの一社独占相当は無い）

| レイヤー | 推奨 | 向いていること |
|----------|------|----------------|
| ホール〜ドームの公演一覧 | **[LIVENEX](https://livenex.live/)** | 東京／京都の「いつ何があるか」の俯瞰 |
| ライブハウス細かい予定 | **[LiveScopra](https://livescopra.app/)** または **[GIGGS](https://giggs.eggs.mu/)** | 渋谷・下北・京都の箱もの |
| チケットの正本リンク | **ぴあ / ローチケ / 公式** | 日付・開演・売りの確認 |
| クラブ／DJ | iFLYER（任意） | 今のブランドでは優先度低め |

### いまのおすすめ組み合わせ

```text
美術: Tokyo Art Beat
音楽: LIVENEX（広め） + LiveScopra/GIGGS（箱） + 気になる公演は公式URL
自分メモ: events 気になるアーティスト／展を inbox に残す
```

ぴあ WEB API は法人契約前提なので、個人のv1では使わない。

## このアプリの役割

- 集約した予定を **見やすくする**（カレンダー／リスト）
- Notion に **1リンクで埋め込む**
- 収集そのものは Cursor 週次 or 将来の取得スクリプト

データは `public/events.json`。更新したらデプロイ（または git push → Vercel）。
