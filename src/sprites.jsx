// スプライト設定ファイル - 経絡ボンバー用
// src/sprites.js

export const SPRITE_SIZE = 32; // 各スプライトのサイズ（ピクセル）

// スプライトシート上の位置（x, y は左上から数えた位置）
export const SPRITES = {
  // ===== プレイヤー =====
  PLAYER: { x: 0, y: 0 },
  
  // ===== 敵キャラクター =====
  ENEMY_NORMAL: { x: 0, y: 2 },  // 通常敵
  ENEMY_FAST: { x: 1, y: 0 },    // 高速敵
  ENEMY_SLOW: { x: 3, y: 0 },    // 重装敵（HP2）
  ENEMY_SMART: { x: 2, y: 5 },   // 知能敵
  
  // ===== アイテム =====
  ITEM_MOXA: { x: 0, y: 7 },     // お灸アイテム
  ITEM_HERB: { x: 1, y: 4 },     // 薬草アイテム
  
  // ===== 武器 =====
  NEEDLE: { x: 7, y: 0 },        // 鍼（通常）
  NEEDLE_ALL: { x: 0, y: 5 },    // 必殺技の鍼（ALLボタン）
  
  // ===== 爆発系 =====
  BOMB: { x: 0, y: 7 },          // お灸（爆弾）
  EXPLOSION: { x: 1, y: 7 },     // 爆発エフェクト
  
  // ===== 壁（ゲームコード側で色指定するため座標不要） =====
  // WALL_SOLID と WALL_BREAK はゲームコード内で背景色として表示
};

// Sprite コンポーネント
export const Sprite = ({ sprite, size = 32, style = {} }) => {
  if (!sprite) return null;
  
  const scale = size / SPRITE_SIZE;
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `url(/spritesheet.png) ${-sprite.x * SPRITE_SIZE}px ${-sprite.y * SPRITE_SIZE}px`,
        // 間隔なし
　　　　　backgroundSize: `${16 * 8 * scale}px auto` // = 128px × scale
        imageRendering: 'pixelated',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// デバッグ用：ゲームで使用するスプライトを表示
export const SpriteViewer = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a2e',
      color: '#fff',
    }}>
      <h2>スプライト一覧</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>プレイヤー</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.PLAYER} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>プレイヤー<br/>(0,0)</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>敵キャラクター</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ENEMY_NORMAL} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>通常敵<br/>(0,3)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ENEMY_FAST} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>高速敵<br/>(0,2)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ENEMY_SLOW} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>重装敵<br/>(4,5)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ENEMY_SMART} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>知能敵<br/>(2,5)</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>アイテム</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ITEM_MOXA} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>お灸<br/>(0,7)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.ITEM_HERB} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>薬草<br/>(1,4)</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>武器</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.NEEDLE} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>鍼<br/>(0,7)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.NEEDLE_ALL} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>必殺鍼<br/>(0,5)</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>爆発系</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.BOMB} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>お灸爆弾<br/>(0,7)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Sprite sprite={SPRITES.EXPLOSION} size={48} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>爆発<br/>(1,7)</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h3>注意事項</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <li>壁は背景色で表示（スプライト不使用）</li>
          <li>SPRITE_SIZE = 16px（スプライト本体）</li>
          <li>SPRITE_GAP = 2px（スプライト間隔）</li>
          <li>SPRITE_STEP = 18px（1マスの実サイズ）</li>
        </ul>
      </div>
    </div>
  );
};

export default { SPRITES, Sprite, SPRITE_SIZE, SpriteViewer };
