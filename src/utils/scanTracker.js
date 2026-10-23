/**
 * AARYA INNOVTECH PVT. LTD.
 * Real-Time QR Code Scan Tracker
 * 
 * Tracks scans/visits using cloud counter API with Vite dev proxy support.
 */

const COUNTER_NAMESPACE = 'aaryainnovtech.com';
const COUNTER_KEY = 'expo_qr_scans';

export async function fetchScanCount() {
  if (typeof window === 'undefined') return 1;

  try {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.startsWith('192.168.');

    // Use local proxy in dev to avoid CORS/adblocker restrictions, direct URL in prod
    const apiBase = isLocal ? '/api/counter' : 'https://abacus.jasoncameron.dev';
    
    // Check if this browser session has already been counted
    const alreadyCountedInSession = sessionStorage.getItem('aarya_qr_counted');
    const shouldIncrement = !alreadyCountedInSession;

    const action = shouldIncrement ? 'hit' : 'get';
    const targetUrl = `${apiBase}/${action}/${COUNTER_NAMESPACE}/${COUNTER_KEY}?_t=${Date.now()}`;

    const response = await fetch(targetUrl);

    if (response.ok) {
      const data = await response.json();
      if (typeof data.value === 'number') {
        if (shouldIncrement) {
          sessionStorage.setItem('aarya_qr_counted', 'true');
        }
        localStorage.setItem('aarya_last_scan_count', data.value.toString());
        console.log('[QR Tracker] Current Scan Count:', data.value);
        return data.value;
      }
    }
  } catch (error) {
    console.warn('[QR Tracker] Network fetch error, using fallback:', error);
  }

  // Graceful fallback to last cached count or 1
  const cached = localStorage.getItem('aarya_last_scan_count');
  return cached ? parseInt(cached, 10) : 1;
}

export default fetchScanCount;
