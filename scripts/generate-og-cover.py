#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_cover():
    width = 1200
    height = 630
    
    # 1. Canvas with Warm Sepia Paper Background (#f4ecd8)
    bg_color = (244, 236, 216)
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # 2. Outer & Inner Classic Editorial Borders
    margin = 32
    draw.rectangle([margin, margin, width - margin, height - margin], outline=(213, 200, 181), width=2)
    inner_margin = 40
    draw.rectangle([inner_margin, inner_margin, width - inner_margin, height - inner_margin], outline=(120, 53, 15), width=1)
    
    # Corner Accents (diamond marks)
    for cx, cy in [
        (inner_margin, inner_margin),
        (width - inner_margin, inner_margin),
        (inner_margin, height - inner_margin),
        (width - inner_margin, height - inner_margin)
    ]:
        draw.polygon([
            (cx, cy - 6),
            (cx + 6, cy),
            (cx, cy + 6),
            (cx - 6, cy)
        ], fill=(180, 83, 9))
    
    # 3. Fonts
    font_bold = "/root/ln.sakayori.studio/public/fonts/NotoSerif-Bold.ttf"
    font_reg = "/root/ln.sakayori.studio/public/fonts/NotoSerif-Regular.ttf"
    
    f_brand = ImageFont.truetype(font_bold, 28)
    f_sub = ImageFont.truetype(font_reg, 16)
    f_title = ImageFont.truetype(font_bold, 54)
    f_tagline = ImageFont.truetype(font_reg, 24)
    f_meta = ImageFont.truetype(font_reg, 18)
    
    # 4. Top Header Banner
    brand_text = "SAKAYORI STUDIO"
    bbox_b = draw.textbbox((0, 0), brand_text, font=f_brand)
    bw = bbox_b[2] - bbox_b[0]
    draw.text(((width - bw) // 2, 80), brand_text, fill=(120, 53, 15), font=f_brand)
    
    sub_text = "LIGHT NOVEL ARCHIVE"
    bbox_s = draw.textbbox((0, 0), sub_text, font=f_sub)
    sw = bbox_s[2] - bbox_s[0]
    draw.text(((width - sw) // 2, 125), sub_text, fill=(180, 83, 9), font=f_sub)
    
    # Delicate separator bar
    sep_y = 160
    draw.line([(width // 2 - 120, sep_y), (width // 2 + 120, sep_y)], fill=(213, 200, 181), width=1)
    draw.polygon([(width // 2, sep_y - 4), (width // 2 + 4, sep_y), (width // 2, sep_y + 4), (width // 2 - 4, sep_y)], fill=(180, 83, 9))
    
    # 5. Central Main Title
    title_text = "Thư viện Light Novel Trực tuyến"
    bbox_t = draw.textbbox((0, 0), title_text, font=f_title)
    tw = bbox_t[2] - bbox_t[0]
    draw.text(((width - tw) // 2, 230), title_text, fill=(41, 37, 36), font=f_title)
    
    # Japanese Accent Title
    jp_text = "酒寄スタジオ · 電子図書館"
    bbox_jp = draw.textbbox((0, 0), jp_text, font=f_tagline)
    jpw = bbox_jp[2] - bbox_jp[0]
    draw.text(((width - jpw) // 2, 310), jp_text, fill=(120, 53, 15), font=f_tagline)
    
    # 6. Description / Principles Line
    desc_text = "Không quảng cáo  ·  Chuẩn văn học  ·  Trải nghiệm đọc dịu mắt"
    bbox_d = draw.textbbox((0, 0), desc_text, font=f_tagline)
    dw = bbox_d[2] - bbox_d[0]
    draw.text(((width - dw) // 2, 380), desc_text, fill=(87, 83, 78), font=f_tagline)
    
    # 7. Bottom Badge & Domain
    bottom_y = 510
    draw.line([(inner_margin + 60, bottom_y), (width - inner_margin - 60, bottom_y)], fill=(213, 200, 181), width=1)
    
    footer_text = "ln.sakayori.studio"
    bbox_f = draw.textbbox((0, 0), footer_text, font=f_meta)
    fw = bbox_f[2] - bbox_f[0]
    draw.text(((width - fw) // 2, bottom_y + 20), footer_text, fill=(120, 53, 15), font=f_meta)
    
    # Save Image
    out_path = "/root/ln.sakayori.studio/public/og-cover.png"
    img.save(out_path, format="PNG", optimize=True)
    print(f"Generated OG cover successfully at: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_og_cover()
