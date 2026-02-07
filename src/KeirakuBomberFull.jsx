import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPRITES, Sprite } from './sprites.jsx';

const GRID_SIZE = 15;
const CELL_SIZE = 32;
const MOXA_TIMER = 2000;
const EXPLOSION_DURATION = 500;
const NEEDLE_SPEED = 50;

const CELL_TYPES = { 
  EMPTY: 0, 
  WALL_BREAK: 1, 
  WALL_SOLID: 2,
  ITEM_MOXA: 3,
  ITEM_HERB: 4,
  ITEM_FIRE: 5,  // 🔥 追加
};

// 敵の種類
const ENEMY_TYPES = {
  NORMAL: { emoji: '👹', speed: 600, pattern: 'random', hp: 1, score: 100 },
  FAST: { emoji: '⚡', speed: 400, pattern: 'chase', hp: 1, score: 150 },
  SLOW: { emoji: '🐢', speed: 800, pattern: 'patrol', hp: 2, score: 200 },
  SMART: { emoji: '🧠', speed: 500, pattern: 'smart', hp: 1, score: 250 },
};

// ステージ定義（5つの臓器）
const STAGES = [
  { 
    id: 0,
    name: '心臓', 
    spirit: '炎帝', 
    shape: 'cross',
    size: 15, 
    color: '#ff5722',
    message: '我が名は炎帝。心の経絡を司る。\n熱き闘志で、心臓の経絡を開通させよ！'
  },
  { 
    id: 1,
    name: '肺', 
    spirit: '白虎', 
    shape: 'donut',
    size: 15, 
    color: '#e0e0e0',
    message: '我が名は白虎。肺の経絡を司る。\n呼吸を整え、肺の経絡を感じ取れ。'
  },
  { 
    id: 2,
    name: '肝臓', 
    spirit: '緑樹', 
    shape: 'square',
    size: 20, 
    color: '#7cb342',
    message: '我が名は緑樹。肝の経絡を司る。\n広き視野で、肝臓の経絡を巡らせよ。'
  },
  { 
    id: 3,
    name: '腎臓', 
    spirit: '玄武', 
    shape: 'lshape',
    size: 20, 
    color: '#1976d2',
    message: '我が名は玄武。腎の経絡を司る。\n深き智慧で、腎臓の経絡を極めよ。'
  },
  { 
    id: 4,
    name: '脾臓', 
    spirit: '黄龍', 
    shape: 'maze',
    size: 25, 
    color: '#ffd700',
    message: '我が名は黄龍。脾の経絡を司る。\n全ての力を統べ、脾臓の経絡を完成させよ！'
  },
];

// 簡易サウンド
const playBeep = (freq, dur) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.2;
    osc.start();
    osc.stop(ctx.currentTime + dur);
    setTimeout(() => ctx.close(), dur * 1000 + 100);
  } catch (e) {}
};

// 効果音システム
const SoundEffects = {
  needle: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      setTimeout(() => ctx.close(), 150);
    } catch (e) {}
  },
  
  moxa: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = 200;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close(), 350);
    } catch (e) {}
  },
  
  explosion: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 550);
    } catch (e) {}
  },
  
  enemyDefeat: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 - i * 100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 0.3);
      }
      
      setTimeout(() => ctx.close(), 350);
    } catch (e) {}
  },
  
  itemGet: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      setTimeout(() => ctx.close(), 450);
    } catch (e) {}
  },
  
  stageClear: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784, 1047];
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
        
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
      
      setTimeout(() => ctx.close(), 1000);
    } catch (e) {}
  }
};

// イントロ画面コンポーネント
const IntroScreen = ({ onStart, onSkip }) => {
  const [page, setPage] = useState(0);
  
  const pages = [
    {
      title: '鍼の理',
      subtitle: '〜 弱虫鍼灸師の異能バトル：特訓編 〜',
      content: [
        '人の身体には「経絡」という',
        '気の流れる道が存在する。',
        '',
        'この経絡を見極め、',
        '劫病に対する力を得るために...',
        '',
        'あなたは柊蒼真となり、',
        '特訓で、五臓六腑の経絡を開通させる必要がある！'
      ]
    },
    {
      title: '世界観',
      subtitle: '〜 五つの試練 〜',
      content: [
        '【心臓】 炎帝が司る情熱の臓器',
        '【肺】   白虎が司る呼吸の臓器',
        '【肝臓】 緑樹が司る解毒の臓器',
        '【腎臓】 玄武が司る浄化の臓器',
        '【脾臓】 黄龍が司る統合の臓器',
        '',
        'それぞれの守護霊が',
        'あなたの腕を試す！'
      ]
    },
    {
      title: '操作方法',
      subtitle: '〜 鍼と灸の技 〜',
      content: [
        '【移動】 ↑↓←→ キー',
        '【お灸】 スペースキー',
        '　　　　 💣を設置（2秒後に爆発）',
        '',
        '【鍼】   Z↑ / X↓ / C← / V→',
        '　　　　 方向指定で💉を発射',
        '',
        '【全方向鍼】 Aキー',
        '　　　　　　 四方向に同時発射'
      ]
    },
    {
      title: 'ゲームルール',
      subtitle: '〜 経絡開通の手引き 〜',
      content: [
        '🎯 目標: 全ての敵を倒せ！',
        '',
        '⚡ アイテム',
        '　🔥 お灸の数 +1',
        '　🌿 鍼の射程 +1',
        '',
        '👹 敵の種類',
        '　👹 通常敵 (HP:1)',
        '　⚡ 高速敵 (HP:1)',
        '　🐢 重装敵 (HP:2)',
        '　🧠 知能敵 (HP:1)',
        '',
        '⚠️ 自分の爆発に注意！'
      ]
    }
  ];
  
  const currentPage = pages[page];
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#1a1a2e',
        border: '3px solid #4ecdc4',
        borderRadius: '15px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(78, 205, 196, 0.5)',
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#ffd700',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          {currentPage.title}
        </div>
        
        <div style={{
          fontSize: '16px',
          color: '#4ecdc4',
          marginBottom: '30px',
          fontStyle: 'italic',
        }}>
          {currentPage.subtitle}
        </div>
        
        <div style={{
          textAlign: 'left',
          fontSize: '14px',
          lineHeight: '1.8',
          marginBottom: '30px',
          minHeight: '280px',
          color: '#ffffff',
        }}>
          {currentPage.content.map((line, i) => (
            <div key={i} style={{
              marginBottom: line === '' ? '10px' : '5px',
              fontWeight: line.startsWith('【') ? 'bold' : 'normal',
              color: line.startsWith('【') ? '#ffd700' : 
                     line.startsWith('　') ? '#e0e0e0' : '#ffffff',
            }}>
              {line}
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '15px',
        }}>
          {pages.map((_, i) => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: i === page ? '#4ecdc4' : '#555',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
        }}>
          {page > 0 && (
            <button onClick={() => setPage(page - 1)} style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#555',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>
              ← 前へ
            </button>
          )}
          
          {page < pages.length - 1 ? (
            <button onClick={() => setPage(page + 1)} style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4ecdc4',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>
              次へ →
            </button>
          ) : (
            <button onClick={onStart} style={{
              padding: '12px 36px',
              fontSize: '18px',
              backgroundColor: '#ffd700',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.3)',
            }}>
              修行を始める！
            </button>
          )}
        </div>
        
        <button onClick={onSkip} style={{
          marginTop: '20px',
          padding: '8px 16px',
          fontSize: '12px',
          backgroundColor: 'transparent',
          color: '#888',
          border: '1px solid #555',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
          スキップ
        </button>
      </div>
    </div>
  );
};

// エンディング画面コンポーネント
const EndingScreen = ({ score, onRestart }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#1a1a2e',
        border: '3px solid #ffd700',
        borderRadius: '15px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
        }}>
          🎊✨🎉
        </div>
        
        <div style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffd700',
          marginBottom: '15px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          全経絡開通！
        </div>
        
        <div style={{
          fontSize: '18px',
          color: '#4ecdc4',
          marginBottom: '30px',
          lineHeight: '1.8',
        }}>
          おめでとうございます！<br/>
          五臓六腑の全ての経絡を<br/>
          見事に開通させました。
        </div>
        
        <div style={{
          fontSize: '24px',
          color: '#ffffff',
          marginBottom: '10px',
        }}>
          最終スコア
        </div>
        
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#ffd700',
          marginBottom: '30px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
        }}>
          {score.toLocaleString()}
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#e0e0e0',
          marginBottom: '30px',
          lineHeight: '1.8',
          padding: '20px',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          borderRadius: '10px',
        }}>
          「気」の流れを自在に操るあなたは<br/>
          もはや名医を超えた存在...<br/>
          <br/>
          <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
            伝説の「経絡の達人」
          </span>
          <br/>
          の称号を得た！
        </div>
        
        <button onClick={onRestart} style={{
          padding: '15px 40px',
          fontSize: '18px',
          backgroundColor: '#4ecdc4',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(78, 205, 196, 0.3)',
        }}>
          最初から再挑戦
        </button>
      </div>
    </div>
  );
};

// 仮想ゲームパッド
const VirtualGamepad = ({ onButtonPress, moxaCount }) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButton = (key, label) => {
    setActiveButton(label);
    onButtonPress(key);
    setTimeout(() => setActiveButton(null), 100);
  };

  const buttonStyle = (label, size = 50) => ({
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: '2px solid #4ecdc4',
    backgroundColor: activeButton === label ? '#4ecdc4' : 'rgba(78, 205, 196, 0.2)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    userSelect: 'none',
    cursor: 'pointer',
    boxShadow: activeButton === label ? '0 0 10px rgba(78, 205, 196, 0.5)' : 'none',
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      padding: '12px 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: '2px solid rgba(78, 205, 196, 0.3)',
    }}>
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <div onTouchStart={() => handleButton('ArrowUp', '↑')} onClick={() => handleButton('ArrowUp', '↑')}
          style={{ ...buttonStyle('↑'), position: 'absolute', top: '0', left: '50px' }}>↑</div>
        <div onTouchStart={() => handleButton('ArrowLeft', '←')} onClick={() => handleButton('ArrowLeft', '←')}
          style={{ ...buttonStyle('←'), position: 'absolute', top: '50px', left: '0' }}>←</div>
        <div onTouchStart={() => handleButton('ArrowRight', '→')} onClick={() => handleButton('ArrowRight', '→')}
          style={{ ...buttonStyle('→'), position: 'absolute', top: '50px', left: '100px' }}>→</div>
        <div onTouchStart={() => handleButton('ArrowDown', '↓')} onClick={() => handleButton('ArrowDown', '↓')}
          style={{ ...buttonStyle('↓'), position: 'absolute', top: '100px', left: '50px' }}>↓</div>
      </div>

      <div>
        <div onTouchStart={() => handleButton(' ', '灸')} onClick={() => handleButton(' ', '灸')}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            border: '3px solid #ff6b6b',
            backgroundColor: activeButton === '灸' ? '#ff6b6b' : 'rgba(255, 107, 107, 0.2)',
            color: '#fff', fontSize: '10px', fontWeight: 'bold',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            touchAction: 'manipulation', cursor: 'pointer',
          }}>
          🔥<div style={{ fontSize: '8px' }}>{moxaCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '50px 50px', gridTemplateRows: '50px 50px', gap: '8px' }}>
        <div onTouchStart={() => handleButton('z', 'Z')} onClick={() => handleButton('z', 'Z')}
          style={buttonStyle('Z')}>Z<br/>↑</div>
        <div onTouchStart={() => handleButton('c', 'C')} onClick={() => handleButton('c', 'C')}
          style={buttonStyle('C')}>C<br/>←</div>
        <div onTouchStart={() => handleButton('x', 'X')} onClick={() => handleButton('x', 'X')}
          style={buttonStyle('X')}>X<br/>↓</div>
        <div onTouchStart={() => handleButton('v', 'V')} onClick={() => handleButton('v', 'V')}
          style={buttonStyle('V')}>V<br/>→</div>
      </div>

      <div onTouchStart={() => handleButton('a', 'A')} onClick={() => handleButton('a', 'A')}
        style={{
    ...buttonStyle('A', 55),
    border: `3px solid ${kiGauge >= 100 ? '#ffd700' : '#666'}`,
    backgroundColor: activeButton === 'A' ? '#ffd700' : (kiGauge >= 100 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(102, 102, 102, 0.2)'),
    opacity: kiGauge >= 100 ? 1 : 0.5,
        }}>
        ALL
      </div>
    </div>
  );
};

const KeirakuBomberFull = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [showEnding, setShowEnding] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(true);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  
  const [grid, setGrid] = useState([]);
  const [items, setItems] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [needles, setNeedles] = useState([]);
  const [moxas, setMoxas] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [moxaCount, setMoxaCount] = useState(0);
  const [needleRange, setNeedleRange] = useState(3);
  const [moxaPower, setMoxaPower] = useState(1); 
  const [needleDirections, setNeedleDirections] = useState(4);
  const [needleSpeed, setNeedleSpeed] = useState(NEEDLE_SPEED);
  const [kiGauge, setKiGauge] = useState(0);

  const gridRef = useRef(grid);
  const moxasRef = useRef(moxas);
  const playerPosRef = useRef(playerPos);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { moxasRef.current = moxas; }, [moxas]);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);

  const currentStage = tutorialMode ? null : STAGES[currentStageIndex];
  const stageSize = currentStage ? currentStage.size : GRID_SIZE;
  const stageColor = currentStage ? currentStage.color : '#4ecdc4';
  const isLargeStage = stageSize > 15;

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  // ステップ7: イベントハンドラ追加
  const handleStartGame = () => {
    setShowIntro(false);
    setTutorialMode(true);
  };

  const handleSkipIntro = () => {
    setShowIntro(false);
    setTutorialMode(false);
    setCurrentStageIndex(0);
    initStage(false, 0);
  };

  const handleRestartFromEnding = () => {
    setShowEnding(false);
    setTutorialMode(true);
    setCurrentStageIndex(0);
    setScore(0);
    setShowIntro(true);
  };

  useEffect(() => {
    if (!isLargeStage) {
      setCameraOffset({ x: 0, y: 0 });
      return;
    }

    const viewportSize = 15;
    const halfViewport = Math.floor(viewportSize / 2);

    let offsetX = Math.max(0, Math.min(playerPos.x - halfViewport, stageSize - viewportSize));
    let offsetY = Math.max(0, Math.min(playerPos.y - halfViewport, stageSize - viewportSize));

    setCameraOffset({ x: offsetX, y: offsetY });
  }, [playerPos, isLargeStage, stageSize]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      const displaySize = isLargeStage ? 15 : stageSize;
      const gameWidth = displaySize * CELL_SIZE;
      const gameHeight = displaySize * CELL_SIZE + 120;
      const windowWidth = window.innerWidth - 20;
      const windowHeight = mobile ? window.innerHeight - 200 : window.innerHeight - 100;
      
      const scaleX = windowWidth / gameWidth;
      const scaleY = windowHeight / gameHeight;
      const newScale = Math.min(scaleX, scaleY, 1);
      
      setScale(newScale);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, [stageSize, isLargeStage]);

  const generateStageShape = useCallback((shape, size) => {
    const grid = Array(size).fill(null).map(() => Array(size).fill(CELL_TYPES.EMPTY));
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (y === 0 || y === size - 1 || x === 0 || x === size - 1) {
          grid[y][x] = CELL_TYPES.WALL_SOLID;
        }
      }
    }
    
    for (let y = 2; y < size - 2; y += 2) {
      for (let x = 2; x < size - 2; x += 2) {
        grid[y][x] = CELL_TYPES.WALL_SOLID;
      }
    }
    
    if (shape === 'cross') {
      const cornerSize = Math.floor(size / 4);
      for (let y = 1; y < cornerSize; y++) {
        for (let x = 1; x < cornerSize; x++) {
          grid[y][x] = CELL_TYPES.WALL_SOLID;
          grid[y][size - 1 - x] = CELL_TYPES.WALL_SOLID;
          grid[size - 1 - y][x] = CELL_TYPES.WALL_SOLID;
          grid[size - 1 - y][size - 1 - x] = CELL_TYPES.WALL_SOLID;
        }
      }
    } else if (shape === 'donut') {
      const center = Math.floor(size / 2);
      const radius = Math.floor(size / 6);
      for (let y = center - radius; y <= center + radius; y++) {
        for (let x = center - radius; x <= center + radius; x++) {
          if (y > 0 && y < size - 1 && x > 0 && x < size - 1) {
            grid[y][x] = CELL_TYPES.WALL_SOLID;
          }
        }
      }
    } else if (shape === 'lshape') {
      const cutSize = Math.floor(size / 3);
      for (let y = 1; y < cutSize; y++) {
        for (let x = size - cutSize; x < size - 1; x++) {
          grid[y][x] = CELL_TYPES.WALL_SOLID;
        }
      }
    } else if (shape === 'maze') {
      for (let y = 3; y < size - 3; y += 3) {
        for (let x = 1; x < size - 1; x++) {
          if (Math.random() < 0.6) {
            grid[y][x] = CELL_TYPES.WALL_SOLID;
          }
        }
      }
    }
    
    return grid;
  }, []);

  const initStage = useCallback((isTutorial = false, stageIndex = 0) => {
    const stage = isTutorial ? null : STAGES[stageIndex];
    const size = stage ? stage.size : GRID_SIZE;
    const shape = stage ? stage.shape : 'square';
    
    let newGrid = generateStageShape(shape, size);
    
    for (let y = 1; y <= 2; y++) {
      for (let x = 1; x <= 2; x++) {
        newGrid[y][x] = CELL_TYPES.EMPTY;
      }
    }
    
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        if (newGrid[y][x] !== CELL_TYPES.EMPTY) continue;
        if ((x === 1 || x === 2) && (y === 1 || y === 2)) continue;
        
        const rand = Math.random();
        if (rand < (isTutorial ? 0.3 : 0.4)) {
          const itemRand = Math.random();
          if (itemRand < 0.08) newGrid[y][x] = CELL_TYPES.ITEM_MOXA;
          else if (itemRand < 0.15) newGrid[y][x] = CELL_TYPES.ITEM_HERB;
          else if (itemRand < 0.18) newGrid[y][x] = CELL_TYPES.ITEM_FIRE;
          else newGrid[y][x] = CELL_TYPES.WALL_BREAK;
        }
      }
    }
    
    setGrid(newGrid);

    const newEnemies = [];
    const enemyTypes = isTutorial 
      ? [ENEMY_TYPES.NORMAL] 
      : [ENEMY_TYPES.NORMAL, ENEMY_TYPES.FAST, ENEMY_TYPES.SLOW, ENEMY_TYPES.SMART];
    
    const enemyCount = isTutorial ? 2 : 4;
    
    for (let i = 0; i < enemyCount; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * (size - 4)) + 2;
        y = Math.floor(Math.random() * (size - 4)) + 2;
        attempts++;
        if (attempts > 100) break;
      } while (
        newGrid[y][x] !== CELL_TYPES.EMPTY ||
        (x < 4 && y < 4) ||
        newEnemies.some(e => e.x === x && e.y === y)
      );
      
      if (attempts <= 100) {
        const type = enemyTypes[i % enemyTypes.length];
        newEnemies.push({ 
          x, y, 
          id: Date.now() + i, 
          type: type,
          hp: type.hp,
          direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]
        });
      }
    }
    setEnemies(newEnemies);
    setPlayerPos({ x: 1, y: 1 });
    setItems([]);
    setScore(0);
    setMoxaCount(isTutorial ? 2 : 0);
    setKiGauge(0); 
    setGameOver(false);
    setGameWon(false);
  }, [generateStageShape]);

  useEffect(() => {
    initStage(true, 0);
  }, [initStage]);

  const movePlayer = useCallback((dx, dy) => {
    if (gameOver || gameWon) return;
    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      if (newX < 0 || newX >= grid[0]?.length || newY < 0 || newY >= grid.length) {
        return prev;
      }
      const cell = grid[newY]?.[newX];
      
      const item = items.find(i => i.x === newX && i.y === newY);
      if (item) {
        SoundEffects.itemGet();
  
        if (item.type === 'moxa') {
          setMoxaCount(c => c + 1);
          setScore(s => s + 50);
        } else if (item.type === 'herb') {
          const rand = Math.random();
          if (rand < 0.33) setNeedleRange(r => Math.min(r + 2, 10));
          else if (rand < 0.66) setNeedleDirections(8);
          else setNeedleSpeed(s => Math.max(s - 10, 20));
          setScore(s => s + 100);
        } else if (item.type === 'fire') {  // 🔥 追加
          setMoxaPower(p => Math.min(p + 1, 3)); // 最大レベル3
          setScore(s => s + 150);
        }
        setItems(prev => prev.filter(i => i.id !== item.id));
      }
      
      if (cell === CELL_TYPES.WALL_SOLID || cell === CELL_TYPES.WALL_BREAK || 
          cell === CELL_TYPES.ITEM_MOXA || cell === CELL_TYPES.ITEM_HERB) {
        return prev;
      }
      
      return { x: newX, y: newY };
    });
  }, [grid, items, gameOver, gameWon]);

  const placeMoxa = useCallback(() => {
    if (gameOver || gameWon || moxaCount <= 0) return;
    if (moxas.find(m => m.x === playerPos.x && m.y === playerPos.y)) return;
    
    SoundEffects.moxa();

    setMoxaCount(c => c - 1);
    setMoxas(prev => [...prev, { x: playerPos.x, y: playerPos.y, timer: MOXA_TIMER, id: Date.now() }]);
  }, [playerPos, moxas, moxaCount, gameOver, gameWon]);

  const shootNeedle = useCallback((direction) => {
    if (gameOver || gameWon) return;

    // 🔥 追加：ALLボタンは気ゲージが満タンの時のみ
    if (direction === 'all' && kiGauge < 100) {
      playBeep(200, 0.1); // 気が足りない音
      return;
    }
    
    SoundEffects.needle();
    
    if (direction === 'all') {
      setKiGauge(0); 
      
      const directions = needleDirections === 8 
        ? ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right']
        : ['up', 'down', 'left', 'right'];
      
      directions.forEach(dir => {
        setNeedles(prev => [...prev, {
          x: playerPos.x, y: playerPos.y, direction: dir,
          id: Date.now() + Math.random(), range: needleRange, traveled: 0,
          isAll: true,
        }]);
      });
    } else {
      setNeedles(prev => [...prev, {
        x: playerPos.x, y: playerPos.y, direction,
        id: Date.now() + Math.random(), range: needleRange, traveled: 0,
        isAll: false,
      }]);
    }
  }, [playerPos, needleRange, needleDirections, gameOver, gameWon]);

  const handleVirtualButton = (key) => {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  // ステップ9: キーボードイベントの修正
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showIntro || showEnding) return; // ← 追加
      
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
      if (e.key === ' ') { e.preventDefault(); placeMoxa(); }
      if (e.key === 'z') shootNeedle('up');
      if (e.key === 'x') shootNeedle('down');
      if (e.key === 'c') shootNeedle('left');
      if (e.key === 'v') shootNeedle('right');
      if (e.key === 'a') shootNeedle('all');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, placeMoxa, shootNeedle, showIntro, showEnding]); // ← 依存配列に追加

  useEffect(() => {
    if (gameOver || gameWon) return;
    const interval = setInterval(() => {
      setMoxas(prev => {
        const updated = prev.map(m => ({ ...m, timer: m.timer - 100 }));
        const exploded = updated.filter(m => m.timer <= 0);
        exploded.forEach(m => {
          SoundEffects.explosion();
          triggerExplosion(m.x, m.y);
        });
        return updated.filter(m => m.timer > 0);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver, gameWon]);

  const triggerExplosion = useCallback((x, y) => {
    const explosionCells = [{ x, y }];
    const distance = 1 + moxaPower; // 🔥 修正：火力に応じて範囲拡大
    const canPenetrate = moxaPower >= 3;
    const dirs = [[-1,0], [1,0], [0,-1], [0,1]];

    dirs.forEach(([dx, dy]) => {
      for (let i = 1; i <= distance; i++) {
        const nx = x + dx * i, ny = y + dy * i;
        if (nx < 0 || nx >= grid[0]?.length || ny < 0 || ny >= grid.length) break;
        const cell = grid[ny]?.[nx];
        if (cell === CELL_TYPES.WALL_SOLID && !canPenetrate) break;
        explosionCells.push({ x: nx, y: ny });
        if (cell === CELL_TYPES.WALL_BREAK || cell === CELL_TYPES.ITEM_MOXA || cell === CELL_TYPES.ITEM_HERB ||
          cell === CELL_TYPES.ITEM_FIRE) break;
      }
    });

    const newExplosions = explosionCells.map(pos => ({ ...pos, id: Date.now() + Math.random() }));
    setExplosions(prev => [...prev, ...newExplosions]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => !newExplosions.some(ne => ne.id === e.id)));
    }, EXPLOSION_DURATION);

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      explosionCells.forEach(({ x, y }) => {
        const cell = newGrid[y]?.[x];
        if (cell === CELL_TYPES.WALL_BREAK) {
          newGrid[y][x] = CELL_TYPES.EMPTY;
          setScore(s => s + 10);
        }
        if (cell === CELL_TYPES.ITEM_MOXA) {
          newGrid[y][x] = CELL_TYPES.EMPTY;
          setItems(prev => [...prev, { x, y, type: 'moxa', id: Date.now() + Math.random() }]);
        }
        if (cell === CELL_TYPES.ITEM_HERB) {
          newGrid[y][x] = CELL_TYPES.EMPTY;
          setItems(prev => [...prev, { x, y, type: 'herb', id: Date.now() + Math.random() }]);
        }
        // 🔥 追加：火力アイテムのドロップ処理
        if (cell === CELL_TYPES.ITEM_FIRE) {
        newGrid[y][x] = CELL_TYPES.EMPTY;
        setItems(prev => [...prev, { x, y, type: 'fire', id: Date.now() + Math.random() }]);
        }
      });
      return newGrid;
    });

    setEnemies(prev => {
      const newEnemies = prev.map(enemy => {
        if (explosionCells.some(e => e.x === enemy.x && e.y === enemy.y)) {
          SoundEffects.enemyDefeat();
          setScore(s => s + enemy.type.score);
          setKiGauge(k => Math.min(k + 25, 100));
          return { ...enemy, hp: enemy.hp - 1 };
        }
        return enemy;
      }).filter(e => e.hp > 0);
      
      if (newEnemies.length === 0) {
        setGameWon(true);
        SoundEffects.stageClear(); 
      }
      return newEnemies;
    });

    if (explosionCells.some(e => e.x === playerPos.x && e.y === playerPos.y)) {
      setGameOver(true);
      playBeep(294, 0.3);
    }
  }, [grid, playerPos, moxaPower]);

  useEffect(() => {
    if (gameOver || gameWon) return;
    const interval = setInterval(() => {
      setNeedles(prev => prev.map(needle => {
        let { x, y, direction, traveled, range } = needle;
        
        if (traveled >= range) return null;
        
        if (direction === 'up') y--;
        if (direction === 'down') y++;
        if (direction === 'left') x--;
        if (direction === 'right') x++;
        if (direction === 'up-left') { x--; y--; }
        if (direction === 'up-right') { x++; y--; }
        if (direction === 'down-left') { x--; y++; }
        if (direction === 'down-right') { x++; y++; }
        
        if (x < 0 || x >= grid[0]?.length || y < 0 || y >= grid.length) {
          return null;
        }
        
        const cell = grid[y]?.[x];
        
        if (cell === CELL_TYPES.WALL_BREAK) {
          setGrid(g => {
            const ng = g.map(row => [...row]);
            ng[y][x] = CELL_TYPES.EMPTY;
            return ng;
          });
          setScore(s => s + 10);
          return null;
        }
        
        if (cell === CELL_TYPES.ITEM_MOXA) {
          setGrid(g => {
            const ng = g.map(row => [...row]);
            ng[y][x] = CELL_TYPES.EMPTY;
            return ng;
          });
          setItems(prev => [...prev, { x, y, type: 'moxa', id: Date.now() + Math.random() }]);
          return null;
        }
        if (cell === CELL_TYPES.ITEM_HERB) {
          setGrid(g => {
            const ng = g.map(row => [...row]);
            ng[y][x] = CELL_TYPES.EMPTY;
            return ng;
          });
          setItems(prev => [...prev, { x, y, type: 'herb', id: Date.now() + Math.random() }]);
          return null;
        }
        
        if (cell === CELL_TYPES.WALL_SOLID) return null;
        
        const hitEnemy = enemies.find(e => e.x === x && e.y === y);
        if (hitEnemy) {
          setEnemies(prev => {
            const newEnemies = prev.map(e => {
              if (e.id === hitEnemy.id) {
                const newHp = e.hp - 1;
                if (newHp <= 0) {
                  SoundEffects.enemyDefeat();
                  setKiGauge(k => Math.min(k + 25, 100)); 
                }
                return { ...e, hp: newHp };
              }
              return e;
            }).filter(e => e.hp > 0);
    
            if (newEnemies.length === 0) {
              setGameWon(true);
              SoundEffects.stageClear();
            }
            return newEnemies;
          });
          setScore(s => s + hitEnemy.type.score);
          return null;
        }
        
        return { ...needle, x, y, traveled: traveled + 1 };
      }).filter(Boolean));
    }, needleSpeed);
    return () => clearInterval(interval);
  }, [grid, enemies, needleSpeed, gameOver, gameWon]);

  useEffect(() => {
    if (gameOver || gameWon || tutorialMode) return;
    
    const interval = setInterval(() => {
      setEnemies(prev => {
        return prev.map(enemy => {
          const { type, direction } = enemy;
          
          const currentGrid = gridRef.current;
          const currentMoxas = moxasRef.current;
          const currentPlayerPos = playerPosRef.current;
          
          if (type.pattern === 'random') {
            const dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
            const validMoves = dirs.filter(({ dx, dy }) => {
              const nx = enemy.x + dx, ny = enemy.y + dy;
              if (nx < 0 || nx >= currentGrid[0]?.length || ny < 0 || ny >= currentGrid.length) return false;
              const cell = currentGrid[ny]?.[nx];
              if (cell === CELL_TYPES.WALL_SOLID || cell === CELL_TYPES.WALL_BREAK || 
                  cell === CELL_TYPES.ITEM_MOXA || cell === CELL_TYPES.ITEM_HERB) return false;
              if (currentMoxas.some(m => m.x === nx && m.y === ny)) return false;
              return true;
            });
            if (validMoves.length === 0) return enemy;
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            return { ...enemy, x: enemy.x + move.dx, y: enemy.y + move.dy };
          }
          
          if (type.pattern === 'chase') {
            if (Math.random() < 0.85) {
              const dx = currentPlayerPos.x - enemy.x;
              const dy = currentPlayerPos.y - enemy.y;
              const moveDir = Math.abs(dx) > Math.abs(dy) 
                ? { dx: Math.sign(dx), dy: 0 }
                : { dx: 0, dy: Math.sign(dy) };
              
              const nx = enemy.x + moveDir.dx, ny = enemy.y + moveDir.dy;
              const cell = currentGrid[ny]?.[nx];
              if (cell === CELL_TYPES.EMPTY && !currentMoxas.some(m => m.x === nx && m.y === ny)) {
                return { ...enemy, x: nx, y: ny };
              }
            }
            return enemy;
          }
          
          if (type.pattern === 'patrol') {
            const dirMap = {
              up: { dx: 0, dy: -1 },
              down: { dx: 0, dy: 1 },
              left: { dx: -1, dy: 0 },
              right: { dx: 1, dy: 0 },
            };
            const oppositeDir = {
              up: 'down', down: 'up', left: 'right', right: 'left',
            };
            
            const move = dirMap[direction];
            const nx = enemy.x + move.dx, ny = enemy.y + move.dy;
            const cell = currentGrid[ny]?.[nx];
            
            if (cell === CELL_TYPES.EMPTY && !currentMoxas.some(m => m.x === nx && m.y === ny)) {
              return { ...enemy, x: nx, y: ny, direction };
            } else {
              return { ...enemy, direction: oppositeDir[direction] };
            }
          }
          
          if (type.pattern === 'smart') {
            const distance = Math.abs(currentPlayerPos.x - enemy.x) + Math.abs(currentPlayerPos.y - enemy.y);
            
            const shouldChase = distance > 5;
            const dx = currentPlayerPos.x - enemy.x;
            const dy = currentPlayerPos.y - enemy.y;
            const moveDir = shouldChase
              ? (Math.abs(dx) > Math.abs(dy) ? { dx: Math.sign(dx), dy: 0 } : { dx: 0, dy: Math.sign(dy) })
              : (Math.abs(dx) > Math.abs(dy) ? { dx: -Math.sign(dx), dy: 0 } : { dx: 0, dy: -Math.sign(dy) });
            
            const nx = enemy.x + moveDir.dx, ny = enemy.y + moveDir.dy;
            const cell = currentGrid[ny]?.[nx];
            if (cell === CELL_TYPES.EMPTY && !currentMoxas.some(m => m.x === nx && m.y === ny)) {
              return { ...enemy, x: nx, y: ny };
            }
            return enemy;
          }
          
          return enemy;
        });
      });
    }, 400);
    
    return () => {
      clearInterval(interval);
    };
  }, [tutorialMode, gameOver, gameWon]);

  useEffect(() => {
    if (gameOver || gameWon) return;
    if (enemies.some(e => e.x === playerPos.x && e.y === playerPos.y)) {
      setGameOver(true);
      playBeep(294, 0.3);
    }
  }, [enemies, playerPos, gameOver, gameWon]);

  // ステップ8: レンダリング条件を追加
  if (showIntro) {
    return <IntroScreen onStart={handleStartGame} onSkip={handleSkipIntro} />;
  }

  if (showEnding) {
    return <EndingScreen score={score} onRestart={handleRestartFromEnding} />;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      paddingTop: isMobile ? '10px' : '0',
      paddingBottom: isMobile ? '180px' : '20px',
      overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}>
        <h1 style={{ 
          color: stageColor, 
          marginBottom: '5px', 
          fontSize: isMobile ? '18px' : '24px',
          textAlign: 'center',
        }}>
          鍼ノ理 - {tutorialMode ? 'チュートリアル' : `${currentStage.name}の特訓（${currentStage.spirit}）`}
        </h1>
        
        <div style={{
          display: 'flex', 
          gap: isMobile ? '8px' : '15px', 
          marginBottom: '8px', 
          fontSize: isMobile ? '9px' : '12px',
          padding: isMobile ? '6px 10px' : '8px 16px',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          border: '2px solid #4ecdc4',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <div>🔥: <strong>{moxaCount}</strong></div>
          <div>💥: <strong>Lv{moxaPower}</strong></div> {/* 🔥 追加 */}
          <div>💉: <strong>{needleRange}</strong></div>
          <div>📐: <strong>{needleDirections}</strong></div>
          <div>👹: <strong>{enemies.length}</strong></div>
          <div>⭐: <strong>{score}</strong></div>
        </div>

        {/* 🔥 追加：気ゲージバー */}
        <div style={{
          width: '100%',
          marginBottom: '8px',
          padding: '0 8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: isMobile ? '10px' : '12px',
          }}>
            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>気</span>
            <div style={{
              flex: 1,
              height: '14px',
              backgroundColor: '#1a1a2e',
              border: '2px solid #ffd700',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${kiGauge}%`,
                height: '100%',
                backgroundColor: kiGauge >= 100 ? '#ffd700' : '#4ecdc4',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }} />
            </div>
            <span style={{ 
              color: kiGauge >= 100 ? '#ffd700' : '#fff',
              fontSize: '10px',
              minWidth: '35px',
            }}>
              {kiGauge}/100
            </span>
          </div>
        </div>

        <div style={{
          position: 'relative',
          width: `${(isLargeStage ? 15 : stageSize) * CELL_SIZE}px`,
          height: `${(isLargeStage ? 15 : stageSize) * CELL_SIZE}px`,
          border: `3px solid ${stageColor}`,
          backgroundColor: '#1a1a1a',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            transform: isLargeStage ? `translate(${-cameraOffset.x * CELL_SIZE}px, ${-cameraOffset.y * CELL_SIZE}px)` : 'none',
            transition: 'transform 0.1s ease-out',
          }}>
            {grid.map((row, y) => row.map((cell, x) => {
              let bgColor = '#0f0f1e';
              let content = '';
              if (cell === CELL_TYPES.WALL_SOLID) bgColor = '#555';
              if (cell === CELL_TYPES.WALL_BREAK) bgColor = '#8b4513';
              if (cell === CELL_TYPES.ITEM_MOXA) bgColor = '#8b4513';
              if (cell === CELL_TYPES.ITEM_HERB) bgColor = '#8b4513';
              return (
                <div key={`${x}-${y}`} style={{
                  position: 'absolute', left: `${x * CELL_SIZE}px`, top: `${y * CELL_SIZE}px`,
                  width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px`,
                  backgroundColor: bgColor, border: '1px solid rgba(78, 205, 196, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>{content}</div>
              );
            }))}

            <div style={{
              position: 'absolute', left: `${playerPos.x * CELL_SIZE}px`,
              top: `${playerPos.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
            }}>
              <Sprite sprite={SPRITES.PLAYER} size={CELL_SIZE} />
            </div>

            {items.map(item => (
              <div key={item.id} style={{
                position: 'absolute', left: `${item.x * CELL_SIZE}px`,
                top: `${item.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', zIndex: 6,
                animation: 'itemBounce 0.5s ease-in-out infinite',
              }}>
                <Sprite 
                  sprite={
                    item.type === 'moxa' ? SPRITES.ITEM_MOXA : 
                    item.type === 'herb' ? SPRITES.ITEM_HERB :
                    SPRITES.ITEM_FIRE
                  } 
                  size={CELL_SIZE * 0.8}
                />
              </div>
            ))}

            {needles.map(n => (
              <div key={n.id} style={{
                position: 'absolute', left: `${n.x * CELL_SIZE}px`,
                top: `${n.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', zIndex: 8,
              }}>
                <Sprite 
                  sprite={n.isAll ? SPRITES.NEEDLE_ALL : SPRITES.NEEDLE} 
                  size={CELL_SIZE * 0.7}
                  style={{
                    transform: 
                      n.direction === 'up' ? 'rotate(-90deg)' :
                      n.direction === 'up-right' ? 'rotate(-45deg)' :
                      n.direction === 'right' ? 'rotate(0deg)' :
                      n.direction === 'down-right' ? 'rotate(45deg)' :
                      n.direction === 'down' ? 'rotate(90deg)' :
                      n.direction === 'down-left' ? 'rotate(135deg)' :
                      n.direction === 'left' ? 'rotate(180deg)' :
                      n.direction === 'up-left' ? 'rotate(225deg)' :
                      'rotate(0deg)',
                  }}
                />
              </div>
            ))}

            {moxas.map(m => (
              <div key={m.id} style={{
                position: 'absolute', left: `${m.x * CELL_SIZE}px`,
                top: `${m.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`, backgroundColor: m.timer < 500 ? '#ff6b6b' : '#ff9800',
                border: '2px solid #fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', animation: m.timer < 500 ? 'blink 0.2s infinite' : 'none', zIndex: 5,
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

            {explosions.map(e => (
              <div key={e.id} style={{
                position: 'absolute', left: `${e.x * CELL_SIZE}px`,
                top: `${e.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`, backgroundColor: '#ff6b6b',
                border: '2px solid #ffeb3b', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', animation: 'explosion 0.5s', zIndex: 15,
              }}>
                <Sprite 
                  sprite={SPRITES.EXPLOSION} 
                  size={CELL_SIZE * 1.3}
                />
              </div>
            ))}

            {enemies.map(enemy => (
              <div key={enemy.id} style={{
                position: 'absolute', left: `${enemy.x * CELL_SIZE}px`,
                top: `${enemy.y * CELL_SIZE}px`, width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', zIndex: 10,
                filter: tutorialMode ? 'grayscale(80%)' : 'none',
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
          </div>
        </div>

        {gameOver && (
          <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.95)', 
            padding: '30px',
            border: '3px solid #ff6b6b', 
            textAlign: 'center', 
            zIndex: 10000,
            writingMode: 'horizontal-tb',
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#ff6b6b',
              writingMode: 'horizontal-tb',
            }}>気虚...</div>
            <div style={{ 
              fontSize: '14px', 
              marginBottom: '15px',
              writingMode: 'horizontal-tb',
            }}>スコア: {score}</div>
            <button onClick={() => initStage(tutorialMode, tutorialMode ? 0 : currentStageIndex)} style={{
              padding: '10px 20px', fontSize: '14px',
              backgroundColor: '#4ecdc4', color: '#fff',
              border: 'none', cursor: 'pointer', borderRadius: '5px',
              writingMode: 'horizontal-tb',
            }}>再挑戦</button>
          </div>
        )}

        {gameWon && (
          <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.95)', 
            padding: '30px',
            border: '3px solid #ffd700', 
            textAlign: 'center', 
            zIndex: 10000,
            writingMode: 'horizontal-tb',
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#ffd700',
              writingMode: 'horizontal-tb',
            }}>経絡開通！</div>
            <div style={{ 
              fontSize: '14px', 
              marginBottom: '15px',
              writingMode: 'horizontal-tb',
            }}>スコア: {score}</div>
            {tutorialMode && (
              <button onClick={() => { 
                setTutorialMode(false); 
                setCurrentStageIndex(0);
                initStage(false, 0); 
              }} style={{
                padding: '10px 20px', fontSize: '14px', marginBottom: '10px',
                backgroundColor: '#ff6b6b', color: '#fff',
                border: 'none', cursor: 'pointer', borderRadius: '5px', display: 'block', width: '100%',
                writingMode: 'horizontal-tb',
              }}>本番モード（心臓の特訓）へ</button>
            )}
            {!tutorialMode && (
              <button onClick={() => { 
                const nextStage = currentStageIndex + 1;
                if (nextStage >= STAGES.length) {
                  setShowEnding(true);
                  setGameWon(false);
                } else {
                  setCurrentStageIndex(nextStage);
                  setGameWon(false);
                  initStage(false, nextStage);
                }
              }} style={{
                padding: '10px 20px', fontSize: '14px', marginBottom: '10px',
                backgroundColor: '#ffd700', color: '#000',
                border: 'none', cursor: 'pointer', borderRadius: '5px', display: 'block', width: '100%',
                fontWeight: 'bold',
                writingMode: 'horizontal-tb',
              }}>
                {currentStageIndex < STAGES.length - 1 
                  ? `次の特訓へ（${STAGES[currentStageIndex + 1].name}）`
                  : '完全制覇！'}
              </button>
            )}
            <button onClick={() => initStage(tutorialMode, tutorialMode ? 0 : currentStageIndex)} style={{
              padding: '10px 20px', fontSize: '14px',
              backgroundColor: '#4ecdc4', color: '#fff',
              border: 'none', cursor: 'pointer', borderRadius: '5px',
              writingMode: 'horizontal-tb',
            }}>もう一度</button>
          </div>
        )}

        {!isMobile && (
          <div style={{
            marginTop: '12px', fontSize: '10px', textAlign: 'center',
            padding: '10px', backgroundColor: '#1a1a2e',
            borderRadius: '8px', border: '2px solid #4ecdc4',
          }}>
            <div style={{ marginBottom: '5px' }}>↑↓←→: 移動 | SPACE: お灸({moxaCount}) | Z↑X↓C←V→: 鍼 | A: 全方向</div>
            {tutorialMode && <div style={{ color: '#ffd700', fontSize: '9px' }}>※チュートリアル: 敵は動きません</div>}
          </div>
        )}
      </div>

      {isMobile && (
        <VirtualGamepad 
          onButtonPress={handleVirtualButton}
          moxaCount={moxaCount}
        />
      )}

      <style>{`
        * {
          writing-mode: horizontal-tb !important;
        }
        
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.5; } }
        @keyframes explosion { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes itemBounce { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-5px); } 
        }
        
        @media (max-width: 767px) {
          body {
            overflow: hidden;
            touch-action: none;
            position: fixed;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default KeirakuBomberFull;
