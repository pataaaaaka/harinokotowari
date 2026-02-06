// スプライト設定ファイル - 経絡ボンバー用（個別画像方式）
// src/sprites.jsx

export const SPRITE_SIZE = 16;

// スプライト画像のパス
export const SPRITES = {
  // ===== プレイヤー =====
  PLAYER: '/sprites/player.png',
  
  // ===== 敵キャラクター =====
  ENEMY_NORMAL: '/sprites/enemy-normal.png',
  ENEMY_FAST: '/sprites/enemy-fast.png',
  ENEMY_SLOW: '/sprites/enemy-slow.png',
  ENEMY_SMART: '/sprites/enemy-smart.png',
  
  // ===== アイテム =====
  ITEM_MOXA: '/sprites/item-moxa.png',
  ITEM_HERB: '/sprites/item-herb.png',
  
  // ===== 武器 =====
  NEEDLE: '/sprites/needle.png',
  NEEDLE_ALL: '/sprites/needle-all.png',
  
  // ===== 爆発系 =====
  BOMB: '/sprites/bomb.png',
  EXPLOSION: '/sprites/explosion.png',
};

// Sprite コンポーネント（個別画像版）
export const Sprite = ({ sprite, size = 32, style = {} }) => {
  if (!sprite) return null;
  
  return (
    <img
      src={sprite}
      alt=""
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'pixelated',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default { SPRITES, Sprite, SPRITE_SIZE };
