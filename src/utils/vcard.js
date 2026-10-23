/**
 * AARYA INNOVTECH PVT. LTD.
 * Smart Contact Integration Utility
 * 
 * - Android: Native Intent directly launching the Phone's Contacts App
 *   (intent://vnd.android.cursor.dir/contact/#Intent;action=android.intent.action.INSERT;...)
 *   NO .vcf file is downloaded!
 * - iOS: Direct vCard data URI for native Apple Contacts
 * - Desktop: Clean .vcf file download
 */

export function generateVCardContent(contact) {
  const nameParts = (contact.directorName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const cleanPhone = (contact.cleanPhone || contact.phone || "").replace(/[^\d+]/g, '');
  const cleanAltPhone = (contact.cleanAltPhone || contact.altPhone || "").replace(/[^\d+]/g, '');

  const lines = [
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
    "END:VCARD"
  ].filter(Boolean);

  return lines.join("\r\n") + "\r\n";
}

/**
 * Returns direct contact href:
 * - Android: intent://vnd.android.cursor.dir/contact/#Intent;action=android.intent.action.INSERT;...
 * - iOS: data:text/vcard;...
 * - Desktop: null
 */
export function getContactHref(contact) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isAndroid) {
    const name = encodeURIComponent(contact.directorName || contact.companyName || "");
    const phone = encodeURIComponent((contact.cleanPhone || contact.phone || "").replace(/[^\d+]/g, ''));
    const altPhone = encodeURIComponent((contact.cleanAltPhone || contact.altPhone || "").replace(/[^\d+]/g, ''));
    const email = encodeURIComponent(contact.salesEmail || contact.email || "");
    const company = encodeURIComponent(contact.companyName || "");

    let intent = `intent://vnd.android.cursor.dir/contact/#Intent;action=android.intent.action.INSERT;S.name=${name};S.phone=${phone};`;
    if (altPhone) intent += `S.secondary_phone=${altPhone};`;
    if (email) intent += `S.email=${email};`;
    if (company) intent += `S.company=${company};`;
    intent += `end;`;

    return intent;
  }

  if (isIOS) {
    const vcard = generateVCardContent(contact);
    return "data:text/vcard;charset=utf-8," + encodeURIComponent(vcard);
  }

  return null;
}

/**
 * Fallback / Desktop vCard file download
 */
export function downloadVCard(contact) {
  const vcardContent = generateVCardContent(contact);
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
    (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    const uri = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardContent);
    window.location.href = uri;
    return true;
  }

  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", "Aarya_Innovtech_Contact.vcf");
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    try {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (_) {}
  }, 1000);

  return true;
}

export default downloadVCard;
