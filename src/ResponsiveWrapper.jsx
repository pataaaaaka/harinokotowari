import React, { useEffect, useState } from 'react';

/**
 * レスポンシブラッパーコンポーネント
 * PWA対応とモバイル最適化を提供
 */
const ResponsiveWrapper = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // PWAインストールプロンプトをキャプチャ
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // すでにインストール済みか確認
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    setInstallPrompt(null);
  };

  return (
    <>
      {children}
      
      {/* PWAインストールバナー */}
      {isInstallable && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(78, 205, 196, 0.95)',
          color: '#1a1a2e',
          padding: '12px 20px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          fontWeight: 'bold',
          fontSize: '14px',
        }}>
          <span>📱</span>
          <span>アプリとしてインストール</span>
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: '#1a1a2e',
              color: '#4ecdc4',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            インストール
          </button>
          <button
            onClick={() => setIsInstallable(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#1a1a2e',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0 5px',
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ResponsiveWrapper;
