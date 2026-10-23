import qrcode
from PIL import Image
import os

url = "https://aaryainnovtech.com/expo/"
print(f"Generating QR Code for: {url}")

# 1. Clean High-Contrast QR Code (Highest scan reliability)
qr_clean = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=16,
    border=4,
)
qr_clean.add_data(url)
qr_clean.make(fit=True)
img_clean = qr_clean.make_image(fill_color="black", back_color="white")

# Save clean versions
clean_path_public = os.path.join("public", "media", "aarya_expo_qr.png")
clean_path_root = "Aarya_Expo_QR_Code.png"

img_clean.save(clean_path_public)
img_clean.save(clean_path_root)
print(f"Saved: {clean_path_public} and {clean_path_root}")

# 2. Executive Branded QR Code with Logo
qr_branded = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error correction allows logo in center
    box_size=20,
    border=4,
)
qr_branded.add_data(url)
qr_branded.make(fit=True)
img_branded = qr_branded.make_image(fill_color="#0A1128", back_color="white").convert("RGBA")

# Try to embed logo if available
logo_path = os.path.join("public", "media", "logo_new.jpeg")
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    
    # Calculate logo dimensions (max 22% of QR size)
    qr_width, qr_height = img_branded.size
    logo_size = int(qr_width * 0.22)
    
    # Maintain aspect ratio or create circular/rounded white background
    logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Create white badge behind logo with border
    badge_size = (logo.width + 24, logo.height + 24)
    badge = Image.new("RGBA", badge_size, "white")
    
    # Paste logo centered onto badge
    badge_pos = ((badge_size[0] - logo.width) // 2, (badge_size[1] - logo.height) // 2)
    badge.paste(logo, badge_pos, logo if logo.mode == 'RGBA' else None)
    
    # Paste badge onto QR center
    pos = ((qr_width - badge_size[0]) // 2, (qr_height - badge_size[1]) // 2)
    img_branded.paste(badge, pos)
    
    branded_path_public = os.path.join("public", "media", "aarya_expo_qr_branded.png")
    img_branded.save(branded_path_public)
    print(f"Saved branded QR: {branded_path_public}")

print("All QR codes successfully generated!")
