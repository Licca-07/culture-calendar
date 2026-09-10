# Culture Calendar

京都⇄東京の **音楽 + 美術** イベントカレンダー（公開Webアプリ）。  
Notion にはこのサイトのURLを貼るだけ。

**更新頻度: 月1回**（[`docs/UPDATE_CADENCE.md`](./docs/UPDATE_CADENCE.md)）

## 公開URL

| 場所 | URL |
|------|-----|
| GitHub（ソース・公開） | https://github.com/Licca-07/culture-calendar |
| GitHub Pages | https://licca-07.github.io/culture-calendar/ |
| Vercel（恒久・推奨） | 下の「Vercelセットアップ」後に確定 |

仮デプロイ（約60分で失効）: https://temporary-flying-aspen-d5d8boq.vercel.app  
Claim: https://vercel.com/claim-deployment?code=c5e4ab7c-2733-411d-aab4-897017e4de68

## Vercelセットアップ（1回だけ・恒久公開）

1. https://vercel.com/new を開く（GitHub連携）
2. `Licca-07/culture-calendar` を Import
3. Framework: **Vite** / Build: `npm run build` / Output: `dist`
4. Deploy
5. 出たURLを Notion に貼る

以降は **月1で `events.json` を更新 → `main` に push** するだけで自動反映。

## データソース

| 分野 | 本線 |
|------|------|
| 美術 | Tokyo Art Beat |
| 音楽 | MAKI core artists → related（LIVENEX/公式は補完） |

- `public/artists.json` … 追う作家
- `public/events.json` … カレンダー本体

## 開発

```bash
npm install
npm run dev
```

## 月次更新

```text
artists.json の core → related で東京/京都の音楽を直近2〜3ヶ月分拾って
events.json を更新。美術は Tokyo Art Beat 視点で。過去分は削除。
```

詳細: `docs/UPDATE_CADENCE.md`
