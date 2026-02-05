// スプライト設定ファイル - 経絡ボンバー用
// src/sprites.js

export const SPRITE_SIZE = 16; // 各スプライトのサイズ（ピクセル）

// スプライトシート上の位置（x, y は左上から数えた位置）
// 左上が (0, 0)、右に行くと x が増え、下に行くと y が増える
export const SPRITES = {
  // ===== プレイヤー =====
  PLAYER_1: { x: 0, y: 0 },  // 医者キャラ（黒髪）
  PLAYER_2: { x: 1, y: 0 },  // 医者キャラ（茶髪）
  PLAYER_3: { x: 2, y: 0 },  // 医者キャラ（金髪）
  
  // デフォルトのプレイヤー
  PLAYER: { x: 0, y: 0 },    // 黒髪の医者キャラ
  
  // ===== 敵キャラクター =====
  // 1行目の敵たち
  ENEMY_PURPLE: { x: 3, y: 3 },   // 紫のキャラ（知能型）
  ENEMY_ORANGE: { x: 0, y: 4 },   // オレンジのキャラ（通常）
  ENEMY_PINK: { x: 4, y: 5 },     // ピンクのキャラ（高速）
  ENEMY_BLUE: { x: 5, y: 5 },     // 青いキャラ
  ENEMY_GREEN: { x: 3, y: 5 },    // 緑のキャラ（重装）
  
  // 2行目の動物・モンスター
  ENEMY_CAT: { x: 0, y: 1 },      // 黒猫
  ENEMY_FOX: { x: 1, y: 1 },      // キツネ
  ENEMY_FROG: { x: 2, y: 1 },     // カエル
  ENEMY_GHOST: { x: 3, y: 1 },    // おばけ
  ENEMY_SKULL: { x: 4, y: 1 },    // ドクロ
  ENEMY_SNAKE: { x: 5, y: 1 },    // ヘビ
  
  // ゲームで使用する敵（タイプ別）
  ENEMY_NORMAL: { x: 3, y: 4 },   // オレンジ（通常敵）
  ENEMY_FAST: { x: 4, y: 5 },     // ピンク（高速敵）
  ENEMY_SLOW: { x: 3, y: 5 },     // 緑（重装敵）HP2
  ENEMY_SMART: { x: 4, y: 5 },    // 紫（知能敵）
  
  // ===== アイテム =====
  // 3行目のアイテム
  ITEM_HEART_RED: { x: 0, y: 2 },     // 赤いハート
  ITEM_HEART_BLUE: { x: 1, y: 2 },    // 青いハート
  ITEM_HEART_YELLOW: { x: 2, y: 2 },  // 黄色いハート
  ITEM_HEART_GREEN: { x: 3, y: 2 },   // 緑のハート
  ITEM_HEART_PURPLE: { x: 4, y: 2 },  // 紫のハート
  
  // 4行目のアイテム
  ITEM_FIRE_RED: { x: 0, y: 3 },      // 赤い炎（お灸に最適！）
  ITEM_FIRE_BLUE: { x: 1, y: 3 },     // 青い炎
  ITEM_LEAF_GREEN: { x: 2, y: 3 },    // 緑の葉（薬草に最適！）
  ITEM_LEAF_YELLOW: { x: 3, y: 3 },   // 黄色の葉
  ITEM_CRYSTAL_BLUE: { x: 4, y: 3 },  // 青いクリスタル
  ITEM_CRYSTAL_RED: { x: 5, y: 3 },   // 赤いクリスタル
  ITEM_CRYSTAL_GREEN: { x: 6, y: 3 }, // 緑のクリスタル
  ITEM_CRYSTAL_YELLOW: { x: 7, y: 3 },// 黄色のクリスタル
  
  // ゲームで使用するアイテム
  ITEM_MOXA: { x: 5, y: 6 },    // 赤い炎（お灸）
  ITEM_HERB: { x: 0, y: 5 },    // 緑の葉（薬草）
  
  // ===== 鍼（針）=====
  // 5行目の武器・道具
  WEAPON_SWORD: { x: 0, y: 4 },    // 剣
  WEAPON_KNIFE: { x: 1, y: 4 },    // ナイフ（鍼に使える！）
  WEAPON_ARROW: { x: 2, y: 4 },    // 矢
  WEAPON_SPEAR: { x: 3, y: 4 },    // 槍
  WEAPON_AXE: { x: 4, y: 4 },      // 斧
  
  // ゲームで使用する鍼
  NEEDLE: { x: 3, y: 7 },       // ナイフを鍼として使用
  
  // ===== 爆弾・爆発 =====
  BOMB_BLACK: { x: 0, y: 5 },      // 黒い爆弾
  BOMB_RED: { x: 1, y: 5 },        // 赤い爆弾
  EXPLOSION_1: { x: 2, y: 5 },     // 爆発エフェクト1
  EXPLOSION_2: { x: 3, y: 5 },     // 爆発エフェクト2
  
  // ゲームで使用
  BOMB: { x: 0, y: 8 },            // お灸（爆弾）
  EXPLOSION: { x: 2, y: 8 },       // 爆発
  
  // ===== 壁・障害物 =====
  WALL_STONE: { x: 0, y: 6 },      // 石の壁
  WALL_BRICK: { x: 1, y: 6 },      // レンガの壁
  WALL_WOOD: { x: 2, y: 6 },       // 木の壁
  BOX_BROWN: { x: 3, y: 6 },       // 茶色の箱（破壊可能な壁に最適！）
  BOX_GRAY: { x: 4, y: 6 },        // 灰色の箱
  
  // ゲームで使用
  WALL_SOLID: { x: 4, y: 8 },      // 石の壁（破壊不可）
  WALL_BREAK: { x: 4, y: 7 },      // 茶色の箱（破壊可能）
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
        backgroundSize: `${SPRITE_SIZE * 8 * scale}px auto`, // 8列のスプライトシート
        imageRendering: 'pixelated',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// デバッグ用：すべてのスプライトを表示
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
          <div><Sprite sprite={SPRITES.PLAYER_1} size={48} /><div>医者1</div></div>
          <div><Sprite sprite={SPRITES.PLAYER_2} size={48} /><div>医者2</div></div>
          <div><Sprite sprite={SPRITES.PLAYER_3} size={48} /><div>医者3</div></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>敵</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div><Sprite sprite={SPRITES.ENEMY_NORMAL} size={48} /><div>通常</div></div>
          <div><Sprite sprite={SPRITES.ENEMY_FAST} size={48} /><div>高速</div></div>
          <div><Sprite sprite={SPRITES.ENEMY_SLOW} size={48} /><div>重装</div></div>
          <div><Sprite sprite={SPRITES.ENEMY_SMART} size={48} /><div>知能</div></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>アイテム</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div><Sprite sprite={SPRITES.ITEM_MOXA} size={48} /><div>お灸</div></div>
          <div><Sprite sprite={SPRITES.ITEM_HERB} size={48} /><div>薬草</div></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>武器</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div><Sprite sprite={SPRITES.NEEDLE} size={48} /><div>鍼</div></div>
          <div><Sprite sprite={SPRITES.BOMB} size={48} /><div>爆弾</div></div>
          <div><Sprite sprite={SPRITES.EXPLOSION} size={48} /><div>爆発</div></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>壁</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div><Sprite sprite={SPRITES.WALL_SOLID} size={48} /><div>固定壁</div></div>
          <div><Sprite sprite={SPRITES.WALL_BREAK} size={48} /><div>破壊可能</div></div>
        </div>
      </div>
    </div>
  );
};

export default { SPRITES, Sprite, SPRITE_SIZE, SpriteViewer };
