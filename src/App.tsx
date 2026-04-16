import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Upload, Download } from 'lucide-react';

const BANDS = [
  { id: 'band_1', name: 'Poppin\'Party', icon: '/assets/band_1.svg' },
  { id: 'band_2', name: 'Afterglow', icon: '/assets/band_2.svg' },
  { id: 'band_3', name: 'Hello, Happy World!', icon: '/assets/band_3.svg' },
  { id: 'band_4', name: 'Pastel*Palettes', icon: '/assets/band_4.svg' },
  { id: 'band_5', name: 'Roselia', icon: '/assets/band_5.svg' },
  { id: 'band_18', name: 'RAISE A SUILEN', icon: '/assets/band_18.svg' },
  { id: 'band_21', name: 'Morfonica', icon: '/assets/band_21.svg' },
  { id: 'band_45', name: 'MyGO!!!!!', icon: '/assets/band_45.svg' },
  { id: 'ave_mujica', name: 'Ave Mujica', icon: '/assets/Ave_Mujica_icon2.png' },
];

const ATTRIBUTES = [
  { id: 'cool', name: '凛冽 (Cool)', icon: '/assets/cool.svg' },
  { id: 'happy', name: '快乐 (Happy)', icon: '/assets/happy.svg' },
  { id: 'powerful', name: '强力 (Powerful)', icon: '/assets/powerful.svg' },
  { id: 'pure', name: '纯净 (Pure)', icon: '/assets/pure.svg' },
];

const FRAMES = [
  { id: 'frame-2', name: '边框 2', image: '/assets/frame-2.png' },
  { id: 'frame-3', name: '边框 3', image: '/assets/frame-3.png' },
  { id: 'frame-4', name: '边框 4', image: '/assets/frame-4.png' },
  { id: 'frame-5', name: '边框 5', image: '/assets/frame-5.png' },
];

const TRAINED_STATUS = [
  { id: 'normal', name: '普通 (Normal)', star: '/assets/star.png' },
  { id: 'trained', name: '特训后 (Trained)', star: '/assets/star_trained.png' },
];

const App: React.FC = () => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [selectedBand, setSelectedBand] = useState(BANDS[0]);
  const [selectedAttr, setSelectedAttr] = useState(ATTRIBUTES[0]);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[3]);
  const [isTrained, setIsTrained] = useState(TRAINED_STATUS[1]);
  const [starCount, setStarCount] = useState(4);

  // Image transform controls
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(100);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
        // Reset transform on new upload
        setOffsetX(0);
        setOffsetY(0);
        setScale(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTransform = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(100);
  };

  const exportCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `bandori-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Bandori 卡面编辑器</h1>
      </header>

      <main className="editor-layout">
        {/* Left Sidebar - Fixed controls */}
        <div className="sidebar">
          <section className="control-group">
            <label className="upload-btn">
              <Upload size={18} /> 上传人物图
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </section>

          <section className="control-group">
            <h3>特训状态</h3>
            <div className="frame-options">
              {TRAINED_STATUS.map((status) => (
                <button
                  key={status.id}
                  className={`text-btn ${isTrained.id === status.id ? 'active' : ''}`}
                  onClick={() => setIsTrained(status)}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h3>选择边框</h3>
            <div className="grid">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  className={`icon-btn ${selectedFrame.id === frame.id ? 'active' : ''}`}
                  onClick={() => setSelectedFrame(frame)}
                  style={{ padding: '2px' }}
                >
                  <img src={frame.image} alt={frame.name} title={frame.name} />
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h3>选择乐队</h3>
            <div className="grid">
              {BANDS.map((band) => (
                <button
                  key={band.id}
                  className={`icon-btn ${selectedBand.id === band.id ? 'active' : ''}`}
                  onClick={() => setSelectedBand(band)}
                >
                  <img src={band.icon} alt={band.name} title={band.name} />
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h3>选择属性</h3>
            <div className="grid">
              {ATTRIBUTES.map((attr) => (
                <button
                  key={attr.id}
                  className={`icon-btn ${selectedAttr.id === attr.id ? 'active' : ''}`}
                  onClick={() => setSelectedAttr(attr)}
                >
                  <img src={attr.icon} alt={attr.name} title={attr.name} />
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h3>星级设置 ({starCount} 星)</h3>
            <div className="star-slider">
              <input
                type="range"
                min="1"
                max="5"
                value={starCount}
                onChange={(e) => setStarCount(parseInt(e.target.value))}
              />
            </div>
          </section>

          <button className="export-btn" onClick={exportCard}>
            <Download size={18} /> 导出为图片 (PNG)
          </button>
        </div>

        {/* Right Side - Preview with Image Adjustments */}
        <div className="preview-area">
          {bgImage && (
            <div className="image-controls">
              <h3>图片调整</h3>
              <div className="slider-group">
                <label>X轴偏移: {offsetX}px</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={offsetX}
                  onChange={(e) => setOffsetX(parseInt(e.target.value))}
                />
              </div>
              <div className="slider-group">
                <label>Y轴偏移: {offsetY}px</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseInt(e.target.value))}
                />
              </div>
              <div className="slider-group">
                <label>缩放: {scale}%</label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                />
              </div>
              <button className="text-btn" onClick={resetTransform}>
                重置
              </button>
            </div>
          )}

          <div className="card-container" ref={cardRef}>
            {/* Frame Layer */}
            <img src={selectedFrame.image} className="frame-overlay" alt="Frame" />

            {/* Character Image Layer */}
            {bgImage ? (
              <div
                className="character-layer"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale / 100})`,
                }}
              >
                <img src={bgImage} className="char-image" alt="Character" draggable={false} />
              </div>
            ) : (
              <div className="bg-placeholder">请上传人物透明背景图</div>
            )}

            {/* Top Overlays */}
            <img src={selectedBand.icon} className="band-overlay" alt="Band" />
            <img src={selectedAttr.icon} className="attr-overlay" alt="Attribute" />

            <div className="stars-overlay">
              {Array.from({ length: starCount }).map((_, i) => (
                <img key={i} src={isTrained.star} alt="Star" className="star-icon" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
