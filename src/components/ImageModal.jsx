import React, { useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

export function ImageModal({ isOpen, onClose, imageSrc, title, onDownload }) {
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

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged Business Card View"
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <h3 className="modal-title">{title}</h3>
            <span className="modal-subtitle">High Definition Original Card</span>
          </div>
          <button 
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-image-wrapper">
          <img 
            src={imageSrc} 
            alt={title}
            className="modal-image"
          />
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="modal-action-btn primary"
            onClick={() => {
              onDownload();
              onClose();
            }}
          >
            <Download size={16} />
            <span>Save Contact (.vcf)</span>
          </button>
          <button 
            type="button" 
            className="modal-action-btn secondary"
            onClick={onClose}
          >
            <span>Close Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
