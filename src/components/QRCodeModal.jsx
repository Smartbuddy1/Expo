import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Copy, Check, QrCode, Sparkles } from 'lucide-react';

import { copyToClipboard } from '../utils/clipboard';

export function QRCodeModal({ isOpen, onClose, data }) {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Use current live URL or fallback to company website
  const qrUrl = typeof window !== 'undefined' ? window.location.href : data.websiteUrl;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Download high-resolution QR Code image as PNG
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a high-res styled download canvas with company name
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    const padding = 32;
    const textHeight = 70;
    
    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + padding * 2 + textHeight;

    // Draw clean background
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect ? ctx.roundRect(0, 0, exportCanvas.width, exportCanvas.height, 20) : ctx.rect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.fill();

    // Draw QR canvas in center
    ctx.drawImage(canvas, padding, padding);

    // Draw Company Branding text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.companyName, exportCanvas.width / 2, canvas.height + padding + 30);

    ctx.fillStyle = '#059669';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Official Digital Business Card', exportCanvas.width / 2, canvas.height + padding + 50);

    const imageUri = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = `${data.shortName || 'AaryaInnovtech'}_QRCode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopyLink = async () => {
    await copyToClipboard(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Digital Business Card QR Code"
    >
      <div className="modal-container qr-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="qr-title-row">
              <QrCode size={18} className="text-emerald" />
              <h3 className="modal-title">Scan QR Code</h3>
            </div>
            <span className="modal-subtitle">Share this Digital Card Instantly</span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close QR Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / QR Code */}
        <div className="qr-modal-body">
          <div className="qr-frame-wrapper" ref={qrRef}>
            <div className="qr-frame">
              <QRCodeCanvas
                value={qrUrl}
                size={220}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="qr-scan-badge">
              <Sparkles size={12} className="text-emerald" />
              <span>Scan with any phone camera</span>
            </div>
          </div>

          <p className="qr-target-url">{qrUrl}</p>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer qr-modal-footer">
          <button 
            type="button" 
            className="modal-action-btn primary"
            onClick={handleDownloadQR}
          >
            {downloaded ? (
              <>
                <Check size={16} />
                <span>QR Saved!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download QR Image</span>
              </>
            )}
          </button>
          <button 
            type="button" 
            className="modal-action-btn secondary"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
