# 🎮 スプライト統合 - 簡単ガイド

## 📦 選んだスプライト

あなたのスプライトシートから、以下の画像を選びました：

| 要素 | 画像 | 座標 | 説明 |
|------|------|------|------|
| **プレイヤー** | 医者キャラ（黒髪） | (0, 0) | 左上の白衣キャラ |
| **敵（通常）** | オレンジキャラ | (4, 0) | オレンジ色 |
| **敵（高速）** | ピンクキャラ | (5, 0) | ピンク色 |
| **敵（重装）** | 緑キャラ | (7, 0) | 緑色・HP2 |
| **敵（知能）** | 紫キャラ | (3, 0) | 紫色 |
| **お灸** | 赤い炎 | (0, 3) | 4行目の赤い炎 |
| **薬草** | 緑の葉 | (2, 3) | 4行目の緑の葉 |
| **鍼** | ナイフ | (1, 4) | 5行目のナイフ |
| **爆弾** | 黒い爆弾 | (0, 5) | 6行目の爆弾 |
| **爆発** | 爆発エフェクト | (2, 5) | 6行目の爆発 |
| **壁（固定）** | 石の壁 | (0, 6) | 7行目の石壁 |
| **壁（破壊）** | 茶色の箱 | (3, 6) | 7行目の箱 |

---

## 🚀 使い方（超簡単！）

### ステップ1: ファイルを配置

```
src/
  ├── sprites.js          ← sprites-configured.js をこの名前で保存
  └── KeirakuBomberFull.jsx

public/
  └── spritesheet.png     ← あなたのスプライトシート
```

### ステップ2: インポート

`KeirakuBomberFull.jsx` の先頭に追加：

```javascript
import { SPRITES, Sprite } from './sprites';
```

### ステップ3: 置き換え（コピペOK！）

#### 🧑‍⚕️ プレイヤー

**変更前：**
```javascript
<div style={{
  position: 'absolute',
  left: `${playerPos.x * CELL_SIZE}px`,
  top: `${playerPos.y * CELL_SIZE}px`,
  width: `${CELL_SIZE}px`,
  height: `${CELL_SIZE}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  zIndex: 10,
}}>🧑‍⚕️</div>
```

**変更後：**
```javascript
<div style={{
  position: 'absolute',
  left: `${playerPos.x * CELL_SIZE}px`,
  top: `${playerPos.y * CELL_SIZE}px`,
  width: `${CELL_SIZE}px`,
  height: `${CELL_SIZE}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}}>
  <Sprite sprite={SPRITES.PLAYER} size={CELL_SIZE} />
</div>
```

---

#### 👹 敵キャラ

**変更前：**
```javascript
{enemies.map(enemy => (
  <div key={enemy.id} style={{
    position: 'absolute',
    left: `${enemy.x * CELL_SIZE}px`,
    top: `${enemy.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    zIndex: 10,
    filter: tutorialMode ? 'grayscale(80%)' : 'none',
  }}>
    {enemy.type.emoji}
    {enemy.hp > 1 && <span style={{...}}>{enemy.hp}</span>}
  </div>
))}
```

**変更後：**
```javascript
{enemies.map(enemy => (
  <div key={enemy.id} style={{
    position: 'absolute',
    left: `${enemy.x * CELL_SIZE}px`,
    top: `${enemy.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  }}>
    <Sprite 
      sprite={
        enemy.type === ENEMY_TYPES.NORMAL ? SPRITES.ENEMY_NORMAL :
        enemy.type === ENEMY_TYPES.FAST ? SPRITES.ENEMY_FAST :
        enemy.type === ENEMY_TYPES.SLOW ? SPRITES.ENEMY_SLOW :
        SPRITES.ENEMY_SMART
      } 
      size={CELL_SIZE}
      style={{
        filter: tutorialMode ? 'grayscale(80%)' : 'none',
      }}
    />
    {enemy.hp > 1 && (
      <span style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        fontSize: '10px',
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#ff6b6b',
        padding: '2px 4px',
        borderRadius: '3px',
        zIndex: 1,
      }}>{enemy.hp}</span>
    )}
  </div>
))}
```

---

#### 🔥 アイテム（お灸・薬草）

**変更前：**
```javascript
{items.map(item => (
  <div key={item.id} style={{
    position: 'absolute',
    left: `${item.x * CELL_SIZE}px`,
    top: `${item.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    zIndex: 6,
    animation: 'itemBounce 0.5s ease-in-out infinite',
  }}>
    {item.type === 'moxa' ? '🔥' : '🌿'}
  </div>
))}
```

**変更後：**
```javascript
{items.map(item => (
  <div key={item.id} style={{
    position: 'absolute',
    left: `${item.x * CELL_SIZE}px`,
    top: `${item.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
    animation: 'itemBounce 0.5s ease-in-out infinite',
  }}>
    <Sprite 
      sprite={item.type === 'moxa' ? SPRITES.ITEM_MOXA : SPRITES.ITEM_HERB} 
      size={CELL_SIZE * 0.8}
    />
  </div>
))}
```

---

#### 💉 鍼

**変更前：**
```javascript
{needles.map(n => (
  <div key={n.id} style={{
    position: 'absolute',
    left: `${n.x * CELL_SIZE}px`,
    top: `${n.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    zIndex: 8,
  }}>💉</div>
))}
```

**変更後：**
```javascript
{needles.map(n => (
  <div key={n.id} style={{
    position: 'absolute',
    left: `${n.x * CELL_SIZE}px`,
    top: `${n.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
  }}>
    <Sprite 
      sprite={SPRITES.NEEDLE} 
      size={CELL_SIZE * 0.7}
      style={{
        transform: 
          n.dx > 0 ? 'rotate(90deg)' :   // 右
          n.dx < 0 ? 'rotate(-90deg)' :  // 左
          n.dy > 0 ? 'rotate(180deg)' :  // 下
          'rotate(0deg)',                // 上
      }}
    />
  </div>
))}
```

---

#### 💣 お灸（爆弾）

**変更前：**
```javascript
{moxas.map(m => (
  <div key={m.id} style={{
    position: 'absolute',
    left: `${m.x * CELL_SIZE}px`,
    top: `${m.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    backgroundColor: m.timer < 500 ? '#ff6b6b' : '#ff9800',
    border: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    animation: m.timer < 500 ? 'blink 0.2s infinite' : 'none',
    zIndex: 5,
  }}>💣</div>
))}
```

**変更後：**
```javascript
{moxas.map(m => (
  <div key={m.id} style={{
    position: 'absolute',
    left: `${m.x * CELL_SIZE}px`,
    top: `${m.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  }}>
    <Sprite 
      sprite={SPRITES.BOMB} 
      size={CELL_SIZE}
      style={{
        filter: m.timer < 500 ? 'brightness(1.5)' : 'none',
        animation: m.timer < 500 ? 'blink 0.2s infinite' : 'none',
      }}
    />
  </div>
))}
```

---

#### 💥 爆発

**変更前：**
```javascript
{explosions.map(e => (
  <div key={e.id} style={{
    position: 'absolute',
    left: `${e.x * CELL_SIZE}px`,
    top: `${e.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    backgroundColor: '#ff6b6b',
    border: '2px solid #ffeb3b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    animation: 'explosion 0.5s',
    zIndex: 15,
  }}>💥</div>
))}
```

**変更後：**
```javascript
{explosions.map(e => (
  <div key={e.id} style={{
    position: 'absolute',
    left: `${e.x * CELL_SIZE}px`,
    top: `${e.y * CELL_SIZE}px`,
    width: `${CELL_SIZE}px`,
    height: `${CELL_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'explosion 0.5s',
    zIndex: 15,
  }}>
    <Sprite 
      sprite={SPRITES.EXPLOSION} 
      size={CELL_SIZE * 1.3}
    />
  </div>
))}
```

---

#### 🧱 壁

**変更前：**
```javascript
{grid.flatMap((row, y) => row.map((cell, x) => {
  let content = '';
  let bg = '#1a1a2e';
  
  if (cell === CELL_TYPES.WALL_SOLID) { 
    content = '🧱'; 
    bg = '#444'; 
  } else if (cell === CELL_TYPES.WALL_BREAK) { 
    content = '📦'; 
    bg = '#8b4513'; 
  }

  return (
    <div key={`${y}-${x}`} style={{
      position: 'absolute',
      left: `${x * CELL_SIZE}px`,
      top: `${y * CELL_SIZE}px`,
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
      backgroundColor: bg,
      border: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
    }}>{content}</div>
  );
}))}
```

**変更後：**
```javascript
{grid.flatMap((row, y) => row.map((cell, x) => {
  let sprite = null;
  let bg = '#1a1a2e';
  
  if (cell === CELL_TYPES.WALL_SOLID) { 
    sprite = SPRITES.WALL_SOLID;
    bg = '#2a2a3e'; 
  } else if (cell === CELL_TYPES.WALL_BREAK) { 
    sprite = SPRITES.WALL_BREAK;
    bg = '#3a2a1e'; 
  }

  return (
    <div key={`${y}-${x}`} style={{
      position: 'absolute',
      left: `${x * CELL_SIZE}px`,
      top: `${y * CELL_SIZE}px`,
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
      backgroundColor: bg,
      border: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {sprite && <Sprite sprite={sprite} size={CELL_SIZE} />}
    </div>
  );
}))}
```

---

## ✅ 完了チェックリスト

- [ ] `sprites-configured.js` を `src/sprites.js` として保存
- [ ] `spritesheet.png` を `public/` に配置
- [ ] KeirakuBomberFull.jsx に `import { SPRITES, Sprite } from './sprites';` を追加
- [ ] プレイヤーを置き換え
- [ ] 敵を置き換え
- [ ] アイテムを置き換え
- [ ] 鍼を置き換え
- [ ] お灸を置き換え
- [ ] 爆発を置き換え
- [ ] 壁を置き換え
- [ ] `npm run dev` で動作確認

---

## 🎮 動作確認

```bash
npm run dev
```

ブラウザで確認：
✅ プレイヤーが医者キャラの画像
✅ 敵がカラフルなキャラの画像
✅ アイテムが炎と葉の画像
✅ すべてがピクセルアート風にシャープに表示

---

## 🎨 おまけ：スプライト確認ツール

すべてのスプライトを確認したい場合、一時的にこれを追加：

```javascript
import { SpriteViewer } from './sprites';

// App.jsx の return の中に
<SpriteViewer />
```

これで全スプライトが一覧表示されます！

---

完成です！🎉
