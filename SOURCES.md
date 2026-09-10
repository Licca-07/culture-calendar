# Culture Calendar — データソース方針

Notion にはこのWebアプリのURLを貼るだけ。収集は別レイヤー。

## 美術 → Tokyo Art Beat（本線）

- サイト: https://www.tokyoartbeat.com/
- 強み: 展覧会の網羅性が高く、mei型の美術導線に合う
- 注意: かつての公開APIは現状あてにしない。v1は **週次で人手／Cursorが拾って JSON に入れる**
- 京都も TAB や公式館サイトで補完

## 音楽 → アーティスト起点（本線）

集約サイトの全件スクレイプはしない。

```text
1. public/artists.json の core（MAKI実装時に羅列した作家が中心）
2. それに紐づく related
3. 補完検索だけ LIVENEX / LiveScopra / 公式
```

詳細: [`docs/MUSIC_ARTISTS.md`](./docs/MUSIC_ARTISTS.md)

| レイヤー | 役割 |
|----------|------|
| `artists.json` | 誰を追うか（コア→関連） |
| LIVENEX / LiveScopra / 公式 | その人たちの公演を探す |
| ぴあ / ローチケ | チケット正本リンク |

### いまのおすすめ組み合わせ

```text
美術: Tokyo Art Beat
音楽: MAKI由来の core artists → related → 公式/LIVENEXで日程
自分メモ: 気になる追加作家は artists.json に足す
```

ぴあ WEB API は法人契約前提なので、個人のv1では使わない。

## このアプリの役割

- 集約した予定を **見やすくする**（カレンダー／リスト）
- Notion に **1リンクで埋め込む**
- 収集そのものは Cursor 週次 or 将来の取得スクリプト

データは `public/events.json`。更新したらデプロイ（または git push → Vercel）。
