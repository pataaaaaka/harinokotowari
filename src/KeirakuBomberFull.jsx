import React, { useState, useEffect, useCallback, useRef } from 'react';

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
