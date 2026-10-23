import React from 'react';
import { Phone, Mail, Globe, CheckCircle2, QrCode } from 'lucide-react';

export function Footer({ data, scanCount }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-footer">
      {/* Quick Direct Contact Links */}
      <div className="quick-contact-row" aria-label="Direct Contact Shortcuts">
        <a 
          href={`tel:${data.cleanCallPhone || data.cleanPhone}`} 
          className="quick-contact-link"
          aria-label={`Call ${data.callPhone || data.phone}`}
          title={`Call ${data.callPhone || data.phone}`}
        >
          <Phone size={15} />
          <span>Call Now</span>
        </a>
        <span className="quick-dot">•</span>
        <a 
          href={`mailto:${data.salesEmail || data.email}`} 
          className="quick-contact-link"
          aria-label={`Email ${data.salesEmail || data.email}`}
          title={`Email ${data.salesEmail || data.email}`}
        >
          <Mail size={15} />
          <span>Email</span>
        </a>
        <span className="quick-dot">•</span>
        <a 
          href={data.websiteUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="quick-contact-link"
          aria-label="Official Website"
          title="Official Website"
        >
          <Globe size={15} />
          <span>Website</span>
        </a>
      </div>

      {/* Live QR Scan Counter Badge */}
      <div className="scan-counter-container" aria-label="Live Total QR Code Scans">
        <div className="scan-counter-badge">
          <span className="live-indicator-dot" />
          <QrCode size={13} className="counter-icon" />
          <span className="counter-label">Total QR Scans:</span>
          <span className="counter-number">
            {scanCount !== null && scanCount !== undefined ? scanCount.toLocaleString() : '1'}
          </span>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-meta">
        <p className="copyright-text">
          © {currentYear} <strong>{data.companyName}</strong>
        </p>
        <div className="security-tag">
          <CheckCircle2 size={13} className="sec-icon" />
          <span>Verified Corporate Profile • ISO Standards Compliant</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
