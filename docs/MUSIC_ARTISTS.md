# 音楽イベント収集ルール（アーティスト中心）

美術は Tokyo Art Beat。  
音楽は **集約サイト全件ではなく、アーティスト起点**。

## 優先順位

```text
1. artists.json の core[] が出演するイベント（東京・京都優先）
2. core に紐づく related[]（共演・対バン・同レーベル・近いシーン）
3. それでも空なら LIVENEX / LiveScopra で core 名検索の補完
```

## MAKIリスト

`public/artists.json` の `core` に **45組** を取り込み済み（`makiImport.status = imported`）。

収集時は東京・京都の公演を優先。海外アーティストは来日・国内公演のみ。

## Cursorへの依頼文

```text
artists.json の core → related の順で、東京/京都の音楽イベントを拾って
events.json を更新して。美術は Tokyo Art Beat 視点で別途足してよい。
```

## アプリ側

- カレンダーは `events.json` を表示
- 各イベントに任意で `artists: ["halley"]` を付け、コア紐付けを残す
