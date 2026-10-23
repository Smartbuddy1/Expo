import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Mail, MessageSquare, Send, Globe } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

// Custom clean brand icons
const WhatsAppIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.78-.877-2.056-.977-.276-.1-.477-.15-.678.15-.2.301-.778.977-.954 1.178-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.235-.244-.588-.493-.508-.678-.517-.175-.008-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.911 1.23 3.112.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.723.23 1.38.197 1.901.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.872.516 3.626 1.416 5.129L2 22l5.006-1.313a9.98 9.98 0 0 0 5.034 1.325h.004c5.524 0 10.012-4.488 10.012-10.012A10.01 10.01 0 0 0 12.04 2z"/>
  </svg>
);

const LinkedInIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.4a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z"/>
  </svg>
);

const FacebookIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

export function ShareModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : data.websiteUrl;
  const shareText = `Digital Business Card of ${data.directorName} (${data.designation}), ${data.companyName}:\n${shareUrl}`;

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

  const handleCopy = async () => {
    await copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Pre-configured direct sharing channels
  const shareChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.12)',
      border: 'rgba(37, 211, 102, 0.3)',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      external: true,
    },
    {
      id: 'sms',
      name: 'Messages',
      icon: MessageSquare,
      color: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.3)',
      href: `sms:?body=${encodeURIComponent(shareText)}`,
      external: false,
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      bg: 'rgba(234, 67, 53, 0.12)',
      border: 'rgba(234, 67, 53, 0.3)',
      href: `mailto:?subject=${encodeURIComponent(`${data.companyName} - Digital Business Card`)}&body=${encodeURIComponent(shareText)}`,
      external: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: '#0A66C2',
      bg: 'rgba(10, 102, 194, 0.12)',
      border: 'rgba(10, 102, 194, 0.3)',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      external: true,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: '#229ED9',
      bg: 'rgba(34, 158, 217, 0.12)',
      border: 'rgba(34, 158, 217, 0.3)',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      external: true,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FacebookIcon,
      color: '#1877F2',
      bg: 'rgba(24, 119, 242, 0.12)',
      border: 'rgba(24, 119, 242, 0.3)',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      external: true,
    },
  ];

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share Digital Business Card"
    >
      <div className="modal-container share-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="share-title-row">
              <Share2 size={18} className="text-emerald" />
              <h3 className="modal-title">Share</h3>
            </div>
            <span className="modal-subtitle">Share this digital card with anyone</span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close Share Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="share-modal-body">
          {/* Copy Link Field */}
          <div className="share-link-box">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="share-link-input"
              aria-label="Card URL"
              onClick={(e) => e.target.select()}
            />
            <button 
              type="button" 
              className={`share-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy Link"
              title="Copy Link"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Share Apps Heading */}
          <div className="share-apps-label">
            <span>Share via App</span>
          </div>

          {/* Grid of sharing options */}
          <div className="share-channels-grid">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  target={channel.external ? '_blank' : '_self'}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  className="share-channel-item"
                  title={`Share on ${channel.name}`}
                  onClick={onClose}
                >
                  <div 
                    className="share-channel-icon-box"
                    style={{ 
                      backgroundColor: channel.bg, 
                      borderColor: channel.border,
                      color: channel.color 
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="share-channel-name">{channel.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="share-modal-footer">
          <p className="share-footer-text">
            © {data.companyName} • Digital Card
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
