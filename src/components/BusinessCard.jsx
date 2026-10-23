import React, { useState, useRef } from 'react';
import { Maximize2, ShieldCheck, Download, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export function BusinessCard({ data, onPreview }) {
  const cardRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  // 3D tilt interaction (desktop mouse tracking)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -6;
    const ry = ((x - centerX) / centerX) * 6;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ rx, ry, gx, gy, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  // Touch Swipe Gesture Detection
  const handleTouchStart = (e) => {
    if (!e.touches[0]) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = Math.max(-5, Math.min(5, ((y - centerY) / centerY) * -5));
    const ry = Math.max(-5, Math.min(5, ((x - centerX) / centerX) * 5));
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ rx, ry, gx, gy, active: true });
  };

  const handleTouchEnd = (e) => {
    handleMouseLeave();
    if (!e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    // Horizontal swipe threshold: 35px & more horizontal than vertical
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // Swiped Left -> go to Back side
        setActiveSide('back');
      } else {
        // Swiped Right -> go to Front side
        setActiveSide('front');
      }
    }
  };

  // Download currently active card side
  const handleDownloadCard = async (e) => {
    e.stopPropagation();
    const currentImg = activeSide === 'front' 
      ? (data.cardImageFront || data.cardImage) 
      : (data.cardImageBack || data.cardImage);
    const fileName = activeSide === 'front' 
      ? 'Aarya_Innovtech_Card_Front.jpeg' 
      : 'Aarya_Innovtech_Card_Back.jpeg';

    try {
      const response = await fetch(currentImg);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = currentImg;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  const handlePreviewClick = () => {
    if (onPreview) {
      const activeImg = activeSide === 'front' 
        ? (data.cardImageFront || data.cardImage) 
        : (data.cardImageBack || data.cardImage);
      onPreview(activeImg);
    }
  };

  return (
    <div className="card-wrapper">
      {/* Top Header Badge */}
      <div className="verified-badge" aria-label="Official Verified Business Card">
        <span className="live-indicator-dot" />
        <ShieldCheck className="verified-icon" size={14} />
        <span>Official Digital Business Card</span>
      </div>

      {/* Main 3D Slideable Card Container */}
      <div 
        ref={cardRef}
        className={`card-container slideable-card ${tilt.active ? 'tilting' : ''}`} 
        style={{
          transform: tilt.active 
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.015, 1.015, 1.015)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.45s ease-out, box-shadow 0.3s ease'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handlePreviewClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePreviewClick();
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActiveSide('back');
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActiveSide('front');
          }
        }}
        aria-label="Aarya Innovtech Pvt Ltd Business Card. Click to view enlarged, or swipe left and right to see front and back."
      >
        {/* Holographic light sheen following cursor/touch */}
        <div 
          className="card-sheen" 
          style={{
            background: tilt.active 
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 35%, transparent 65%)` 
              : undefined,
            opacity: tilt.active ? 1 : 0.4
          }}
        />

        {/* Right-side Download Card Button */}
        <button
          type="button"
          className={`card-download-btn ${isDownloaded ? 'downloaded' : ''}`}
          onClick={handleDownloadCard}
          title={isDownloaded ? 'Downloaded!' : `Download ${activeSide === 'front' ? 'Front' : 'Back'} Card`}
          aria-label={`Download ${activeSide === 'front' ? 'Front' : 'Back'} Business Card`}
        >
          {isDownloaded ? (
            <Check size={16} className="text-emerald" />
          ) : (
            <Download size={16} />
          )}
          <span className="download-btn-tooltip">
            {isDownloaded ? 'Saved!' : `Download ${activeSide === 'front' ? 'Front' : 'Back'}`}
          </span>
        </button>

        {/* Floating Left Arrow (Slide to Front) */}
        {activeSide === 'back' && (
          <button
            type="button"
            className="card-nav-arrow arrow-left visible"
            onClick={(e) => { e.stopPropagation(); setActiveSide('front'); }}
            aria-label="Slide to Front Side"
            title="Front Side"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Floating Right Arrow (Slide to Back) */}
        {activeSide === 'front' && (
          <button
            type="button"
            className="card-nav-arrow arrow-right visible"
            onClick={(e) => { e.stopPropagation(); setActiveSide('back'); }}
            aria-label="Slide to Back Side"
            title="Back Side"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* 2-Slide Track (Front and Back side-by-side) */}
        <div className="card-slider-viewport">
          <div 
            className="card-slider-track"
            style={{
              transform: activeSide === 'front' ? 'translateX(0%)' : 'translateX(-50%)'
            }}
          >
            {/* Front Slide */}
            <div className="card-slide">
              <img
                src={data.cardImageFront || data.cardImage}
                alt={`${data.companyName} Business Card Front`}
                className="card-image"
                loading="eager"
              />
            </div>

            {/* Back Slide */}
            <div className="card-slide">
              <img
                src={data.cardImageBack || data.cardImage}
                alt={`${data.companyName} Business Card Back - Smart Buddy`}
                className="card-image"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Tap to Enlarge hover pill */}
        <div className="card-hover-overlay">
          <span className="expand-pill">
            <Maximize2 size={14} />
            <span>Tap to enlarge</span>
          </span>
        </div>
      </div>

      {/* Swipe Hint below the card */}
      <div className="card-switcher-container">
        <span className="card-swipe-hint">
          👈 Swipe left or right to slide 👉
        </span>
      </div>
    </div>
  );
}

export default BusinessCard;
