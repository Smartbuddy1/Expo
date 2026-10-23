import React, { useState } from 'react';
import { 
  UserPlus, 
  Globe, 
  ShoppingBag, 
  Check, 
  Share2, 
  Building2,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import companyData from './config/companyData';
import { downloadVCard } from './utils/vcard';
import BusinessCard from './components/BusinessCard';
import ActionButton from './components/ActionButton';
import ImageModal from './components/ImageModal';
import ShareModal from './components/ShareModal';
import Footer from './components/Footer';
import './App.css';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(companyData.cardImageFront || companyData.cardImage);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // vCard file download (for modal or desktop use)
  const handleDownloadVCard = () => {
    try {
      downloadVCard(companyData);
    } catch (err) {
      console.error('Failed to trigger contact save:', err);
    }
  };

  // Open native system share sheet (only installed apps) if supported, else open clean ShareModal
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : companyData.websiteUrl;
    const shareData = {
      title: `${companyData.directorName} - ${companyData.companyName}`,
      text: `Digital Business Card of ${companyData.directorName} (${companyData.designation}), ${companyData.companyName}:\n${shareUrl}`,
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
      }
    }

    setIsShareModalOpen(true);
  };

  return (
    <div className="app-viewport">
      {/* Dynamic Background Effects */}
      <div className="bg-gradient-glow glow-top" />
      <div className="bg-gradient-glow glow-bottom" />
      <div className="bg-grid-pattern" />

      {/* Main Container */}
      <main className="card-page-container">
        {/* Top Company Brand Header */}
        <header className="brand-header">
          <div className="brand-logo-container" title={companyData.companyName}>
            <img 
              src={companyData.companyLogo} 
              alt={companyData.companyName}
              className="brand-logo-img"
            />
          </div>
          <h1 className="visually-hidden">
            AARYA INNOVTECH PVT. LTD. Digital Business Card
          </h1>
          <div className="header-actions">
            <button 
              type="button" 
              className="header-action-btn share-btn"
              onClick={handleShare}
              aria-label="Share this digital card"
              title="Share Card"
            >
              <Share2 size={15} />
              <span className="btn-text">Share</span>
            </button>
          </div>
        </header>

        {/* 1. Main Business Card at the Top */}
        <section className="section-card" aria-label="Business Card Presentation">
          <BusinessCard 
            data={companyData} 
            onPreview={(imgSrc) => {
              setModalImage(imgSrc || companyData.cardImageFront || companyData.cardImage);
              setIsModalOpen(true);
            }}
          />
        </section>

        {/* Share Feedback Banner */}
        {shareSuccess && (
          <div className="download-toast share-toast" role="status" aria-live="polite">
            <div className="toast-icon-box">
              <Check size={18} />
            </div>
            <div className="toast-content">
              <p className="toast-title">Link Copied to Clipboard!</p>
              <p className="toast-desc">
                Paste anywhere (WhatsApp, SMS, Email) to share this digital card.
              </p>
            </div>
          </div>
        )}

        {/* 2. Action Buttons in strict required order */}
        <section className="section-actions" aria-label="Primary Actions">
          {/* Button 1: Add to Contact (Direct Phone / Dialer Action - Zero Downloads) */}
          <ActionButton
            id="btn-add-contact"
            label="Add to Contact"
            subtitle="Save Directly to Phone Contacts"
            icon={UserPlus}
            variant="primary"
            href={`tel:${companyData.cleanCallPhone || companyData.cleanPhone}`}
            ariaLabel={`Add ${companyData.directorName} to contacts via phone dialer`}
          />

          {/* Button 2: Visit Our Website */}
          <ActionButton
            id="btn-visit-website"
            label="Visit Our Website"
            subtitle="aaryainnovtech.com"
            icon={Globe}
            variant="secondary"
            href={companyData.websiteUrl}
            isExternal={true}
            ariaLabel="Visit Aarya Innovtech Official Website in a new tab"
          />

          {/* Button 3: Products */}
          <ActionButton
            id="btn-our-products"
            label="Our Products"
            subtitle="Explore our product catalog"
            icon={ShoppingBag}
            variant="accent"
            href={companyData.productsUrl}
            isExternal={true}
            ariaLabel="Explore Aarya Innovtech Products catalog in a new tab"
          />

          {/* Button 4: Achievements */}
          <ActionButton
            id="btn-achievements"
            label="Achievements"
            subtitle="Milestones & corporate recognitions"
            icon={Trophy}
            variant="achievement"
            href={companyData.achievementsUrl}
            isExternal={true}
            ariaLabel="View Aarya Innovtech Achievements in a new tab"
          />
        </section>

        {/* Flagship Brand Section: Smart Buddy */}
        <section className="flagship-brand-section" aria-label="Our Flagship Brand">
          <a 
            href={companyData.productsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flagship-card"
            title="Explore Smart Buddy Products"
          >
            <div className="flagship-card-header">
              <span className="flagship-pill">Our Flagship Brand</span>
              <span className="flagship-link-hint">
                <span>Explore Products</span>
                <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="flagship-logo-box">
              <img 
                src={companyData.flagshipLogo} 
                alt={`${companyData.flagshipName} - Aarya Innovtech`}
                className="flagship-logo-img"
                onError={(e) => {
                  if (e.currentTarget.src !== companyData.flagshipLogoFallback) {
                    e.currentTarget.src = companyData.flagshipLogoFallback;
                  }
                }}
              />
            </div>
          </a>
        </section>

        {/* Footer with quick dial & copyright */}
        <Footer data={companyData} />
      </main>

      {/* Lightbox Image Preview Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={modalImage}
        title={companyData.companyName}
        onDownload={handleDownloadVCard}
      />

      {/* Dedicated Share Window Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={companyData}
      />
    </div>
  );
}

export default App;
