# 経絡ボンバー - アップデートガイド

## 実装する変更点

### 1. 効果音システムの追加
### 2. イントロ画面の追加
### 3. エンディング画面の追加
### 4. 最終ステージ後のループ修正

---

## 📝 変更手順

### ステップ1: 効果音システムを追加

`KeirakuBomberFull.jsx` の `playBeep` 関数の後に以下を追加：

```javascript
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
      const notes = [523, 659, 784, 1047]; // C-E-G-C
      
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
```

---

### ステップ2: 効果音を呼び出す

以下の箇所で効果音を追加：

#### 鍼を撃つとき（shootNeedle関数内）
```javascript
const shootNeedle = useCallback((direction) => {
  if (gameOver || gameWon) return;
  
  SoundEffects.needle(); // ← 追加
  
  // 既存のコード...
```

#### お灸を置くとき（placeMoxa関数内）
```javascript
const placeMoxa = useCallback(() => {
  if (gameOver || gameWon || moxaCount <= 0) return;
  if (moxas.some(m => m.x === playerPos.x && m.y === playerPos.y)) return;
  
  SoundEffects.moxa(); // ← 追加
  
  // 既存のコード...
```

#### お灸の爆発時（moxas useEffect内）
```javascript
toExplode.forEach(m => {
  SoundEffects.explosion(); // ← 追加
  
  // 既存のコード...
```

#### 敵撃破時（2箇所）
```javascript
// 鍼で敵を倒したとき
if (newHp <= 0) {
  SoundEffects.enemyDefeat(); // ← 追加
  setScore(s => s + enemy.type.score);
  return null;
}

// 爆発で敵を倒したとき
if (newHp <= 0) {
  SoundEffects.enemyDefeat(); // ← 追加
  setScore(s => s + enemy.type.score);
  return null;
}
```

#### アイテム取得時（handleMove関数内）
```javascript
const itemAtPos = items.find(item => item.x === newX && item.y === newY);
if (itemAtPos) {
  SoundEffects.itemGet(); // ← 追加
  
  // 既存のコード...
```

#### ステージクリア時
```javascript
useEffect(() => {
  if (tutorialMode || enemies.length > 0 || gameOver || gameWon) return;
  
  SoundEffects.stageClear(); // ← 追加
  setGameWon(true);
}, [enemies, tutorialMode, gameOver, gameWon]);
```

---

### ステップ3: State追加

KeirakuBomberFull コンポーネントの先頭で state を追加：

```javascript
const [showIntro, setShowIntro] = useState(true); // ← 追加
const [showEnding, setShowEnding] = useState(false); // ← 追加
```

---

### ステップ4: エンディング処理の修正

ゲームクリア画面の「次の特訓へ」ボタンのonClick を修正：

```javascript
{!tutorialMode && (
  <button onClick={() => { 
    const nextStage = currentStageIndex + 1;
    if (nextStage >= STAGES.length) {
      // 全ステージクリア - エンディング表示
      setShowEnding(true); // ← 追加
      setGameWon(false); // ← 追加
    } else {
      setCurrentStageIndex(nextStage);
      setGameWon(false);
      initStage(false, nextStage);
    }
  }} style={{
    // スタイル...
  }}>
    {currentStageIndex < STAGES.length - 1 
      ? `次の特訓へ（${STAGES[currentStageIndex + 1].name}）`
      : '完全制覇！'} {/* ← ボタンテキスト変更 */}
  </button>
)}
```

---

### ステップ5: イントロ画面コンポーネントを追加

VirtualGamepad コンポーネントの前に追加：

```javascript
// イントロ画面コンポーネント
const IntroScreen = ({ onStart, onSkip }) => {
  const [page, setPage] = useState(0);
  
  const pages = [
    {
      title: '経絡ボンバー',
      subtitle: '〜 東洋医学秘伝の書 〜',
      content: [
        '人の身体には「経絡」という',
        '気の流れる道が存在する。',
        '',
        'この経絡が滞ると、',
        '身体の不調を引き起こす...',
        '',
        'あなたは名医となり、',
        '五臓六腑の経絡を開通させよ！'
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
```

---

### ステップ6: エンディング画面コンポーネントを追加

IntroScreen コンポーネントの後に追加：

```javascript
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
```

---

### ステップ7: イベントハンドラ追加

KeirakuBomberFull コンポーネント内に以下を追加：

```javascript
const handleStartGame = () => {
  setShowIntro(false);
  setTutorialMode(true);
};

const handleSkipIntro = () => {
  setShowIntro(false);
  setTutorialMode(false);
};

const handleRestartFromEnding = () => {
  setShowEnding(false);
  setTutorialMode(true);
  setCurrentStageIndex(0);
  setScore(0);
  setShowIntro(true);
};
```

---

### ステップ8: レンダリング条件を追加

return文の最初に以下を追加：

```javascript
if (showIntro) {
  return <IntroScreen onStart={handleStartGame} onSkip={handleSkipIntro} />;
}

if (showEnding) {
  return <EndingScreen score={score} onRestart={handleRestartFromEnding} />;
}
```

---

### ステップ9: キーボードイベントの修正

handleKeyDown関数を修正：

```javascript
const handleKeyDown = useCallback((e) => {
  if (showIntro || showEnding) return; // ← 追加
  
  e.preventDefault();
  // 既存のコード...
}, [handleMove, placeMoxa, shootNeedle, showIntro, showEnding]); // ← 依存配列に追加
```

---

## ✅ 完了チェックリスト

- [ ] 効果音システム (SoundEffects) を追加
- [ ] 鍼の音を追加
- [ ] お灸の音を追加
- [ ] 爆発音を追加
- [ ] 敵撃破音を追加
- [ ] アイテム取得音を追加
- [ ] ステージクリア音を追加
- [ ] イントロ画面コンポーネントを追加
- [ ] エンディング画面コンポーネントを追加
- [ ] showIntro, showEnding の state を追加
- [ ] 最終ステージ後のエンディング処理を追加
- [ ] イベントハンドラを追加
- [ ] レンダリング条件を追加

---

## 🎮 動作確認

1. ゲーム起動時にイントロ画面が表示される
2. 4ページの説明を読める
3. スキップボタンで飛ばせる
4. 各アクションで効果音が鳴る
5. 最終ステージクリア後にエンディング表示
6. エンディングから最初に戻れる

---

## 📝 備考

- 効果音はWeb Audio APIを使用
- ブラウザによって音質が異なる場合あり
- モバイルでは初回タップで音が鳴り始める
