import React, { useState, useRef } from 'react';
import { Maximize2, ShieldCheck, Phone, Mail, Globe, Download, Check } from 'lucide-react';

export function BusinessCard({ data, onPreview }) {
  const cardRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  // Interactive 3D tilt calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -7;
    const ry = ((x - centerX) / centerX) * 7;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ rx, ry, gx, gy, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = Math.max(-6, Math.min(6, ((y - centerY) / centerY) * -6));
    const ry = Math.max(-6, Math.min(6, ((x - centerX) / centerX) * 6));
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ rx, ry, gx, gy, active: true });
  };

  const handleDownloadCard = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(data.cardImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Aarya_Innovtech_Business_Card.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = data.cardImage;
      link.download = 'Aarya_Innovtech_Business_Card.jpeg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <div className="card-wrapper">
      {/* Verification Pill with live pulse */}
      <div className="verified-badge" aria-label="Official Verified Business Card">
        <span className="live-indicator-dot" />
        <ShieldCheck className="verified-icon" size={14} />
        <span>Official Digital Business Card</span>
      </div>

      {/* Main 3D Card Container */}
      <div 
        ref={cardRef}
        className={`card-container ${tilt.active ? 'tilting' : ''}`} 
        style={{
          transform: tilt.active 
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out, box-shadow 0.3s ease'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        onClick={onPreview}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreview();
          }
        }}
        aria-label="Aarya Innovtech Pvt Ltd Business Card. Click to view enlarged."
      >
        {/* Holographic light sheen following cursor/touch */}
        <div 
          className="card-sheen" 
          style={{
            background: tilt.active 
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 35%, transparent 65%)` 
              : undefined,
            opacity: tilt.active ? 1 : 0.45
          }}
        />

        {/* Right-side Download Card Button */}
        <button
          type="button"
          className={`card-download-btn ${isDownloaded ? 'downloaded' : ''}`}
          onClick={handleDownloadCard}
          title={isDownloaded ? 'Downloaded!' : 'Download Business Card Image'}
          aria-label="Download Business Card Image"
        >
          {isDownloaded ? (
            <Check size={16} className="text-emerald" />
          ) : (
            <Download size={16} />
          )}
          <span className="download-btn-tooltip">
            {isDownloaded ? 'Saved!' : 'Download Card'}
          </span>
        </button>
        
        {!imgError ? (
          <div className="card-image-box">
            {!imgLoaded && (
              <div className="card-skeleton">
                <div className="skeleton-pulse" />
              </div>
            )}
            <img
              src={data.cardImage}
              alt={`${data.companyName} Business Card - ${data.directorName}, ${data.designation}`}
              className={`card-image ${imgLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="eager"
            />
            <div className="card-hover-overlay">
              <span className="expand-pill">
                <Maximize2 size={14} />
                <span>Tap to enlarge</span>
              </span>
            </div>
          </div>
        ) : (
          /* High-grade Digital Card fallback if image is not accessible */
          <div className="digital-card-fallback">
            <div className="digital-card-header">
              <div className="digital-card-logo">
                <span className="logo-initial">A</span>
              </div>
              <div className="digital-card-brand">
                <h2 className="brand-title">{data.companyName}</h2>
                <p className="brand-role">{data.directorName} • {data.designation}</p>
              </div>
            </div>
            <div className="digital-card-divider" />
            <div className="digital-card-details">
              <div className="detail-item">
                <Phone size={14} />
                <span>{data.phone}</span>
              </div>
              <div className="detail-item">
                <Mail size={14} />
                <span>{data.email}</span>
              </div>
              <div className="detail-item">
                <Globe size={14} />
                <span>{data.websiteUrl.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessCard;
