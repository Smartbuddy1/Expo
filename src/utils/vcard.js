/**
 * Generates and triggers universal vCard (.vcf) saving.
 * Clean RFC-compliant vCard 3.0 compatible with Android (Samsung, Xiaomi, Vivo, Oppo, OnePlus, Pixel)
 * and iOS (iPhone/iPad).
 */
export function downloadVCard(contact) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Clean names
  const nameParts = (contact.directorName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Pure standard vCard 3.0 lines (WITHOUT invalid CHARSET parameters which break Android parsers)
  const cleanPhone = (contact.cleanPhone || contact.phone || "").replace(/[^\d+]/g, '');
  const cleanAltPhone = (contact.cleanAltPhone || contact.altPhone || "").replace(/[^\d+]/g, '');

  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//Aarya Innovtech//Digital Business Card//EN",
    `N:${lastName};${firstName};;;`,
    `FN:${contact.directorName || contact.companyName}`,
    `ORG:${contact.companyName}`,
    contact.designation ? `TITLE:${contact.designation}` : null,
    cleanPhone ? `TEL;TYPE=CELL,VOICE,PREF:${cleanPhone}` : null,
    cleanAltPhone ? `TEL;TYPE=WORK,VOICE:${cleanAltPhone}` : null,
    contact.salesEmail || contact.email ? `EMAIL;TYPE=WORK,INTERNET,PREF:${contact.salesEmail || contact.email}` : null,
    contact.directorEmail ? `EMAIL;TYPE=INTERNET:${contact.directorEmail}` : null,
    contact.websiteUrl ? `URL:${contact.websiteUrl}` : null,
    contact.note ? `NOTE:${contact.note}` : null,
    "END:VCARD"
  ].filter(Boolean);

  const vcardContent = vcardLines.join("\r\n") + "\r\n";

  if (isIOS) {
    // iOS Safari native Contact Card handler
    const uri = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardContent);
    window.location.href = uri;
    return true;
  }

  // Android & Desktop: Create clean UTF-8 Blob and trigger direct download
  const blob = new Blob([vcardContent], { type: "text/x-vcard;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const fileName = contact.vcardFileName || "Sujata_Bachhav.vcf";
  
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 1000);

  return true;
}

export default downloadVCard;
