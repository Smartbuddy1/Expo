/**
 * Robust clipboard copy utility.
 * Works seamlessly across both HTTPS and insecure HTTP contexts (like local network IP 192.168.x.x).
 */
export async function copyToClipboard(text) {
  // Method 1: Modern navigator.clipboard API if available and in secure context
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Method 2: Universal document.execCommand fallback for HTTP / mobile local network
  return new Promise((resolve) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    
    // Select text across iOS & Android
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      resolve(successful);
    } catch {
      document.body.removeChild(textArea);
      resolve(false);
    }
  });
}

export default copyToClipboard;
