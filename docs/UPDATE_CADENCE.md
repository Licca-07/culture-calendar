# 更新スケジュール

イベント・展覧会カレンダーは **月に1回** 更新する。

## 毎月やること（目安 30〜60分）

1. `public/artists.json` の core を確認（増減あれば直す）
2. Cursor に依頼:

```text
artists.json の core → related の順で、東京/京都の音楽イベントを直近2〜3ヶ月分拾って
events.json を更新して。美術は Tokyo Art Beat 視点で足して。
終わったイベントは削除 or アーカイブ。
```

3. ローカル確認: `npm run dev`
4. `git commit` → `git push`（Vercel が自動デプロイ）

## 自動化

- GitHub Actions: 毎月1日に Issue を立ててリマインド（実装済み）
- Vercel: `main` push で本番反映

## Notion

公開URLを1つ貼るだけ。データ更新のたびにNotion側は触らなくてよい。
