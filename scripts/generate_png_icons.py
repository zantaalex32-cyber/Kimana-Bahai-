import zlib
import struct
import math
import os

def create_png(width, height, rgba_data):
    """
    rgba_data: bytearray of size width * height * 4
    """
    def chunk(chunk_type, data):
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)

    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr_data)
    
    # IDAT (filter 0 before every row)
    raw_scanlines = bytearray()
    row_bytes = width * 4
    for y in range(height):
        raw_scanlines.append(0) # filter type none
        raw_scanlines.extend(rgba_data[y * row_bytes : (y + 1) * row_bytes])
        
    compressed = zlib.compress(bytes(raw_scanlines), 9)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png

def draw_logo(size, is_maskable=False):
    buffer = bytearray(size * size * 4)
    cx, cy = size / 2.0, size / 2.0
    scale = size / 512.0
    
    bg_r, bg_g, bg_b = 136, 36, 85 # #882455
    corner_radius = 0 if is_maskable else 128 * scale
    
    # Fill background
    for y in range(size):
        for x in range(size):
            idx = (y * size + x) * 4
            if is_maskable:
                # Full bleed solid background
                buffer[idx] = bg_r
                buffer[idx+1] = bg_g
                buffer[idx+2] = bg_b
                buffer[idx+3] = 255
            else:
                # Rounded rectangle
                dx = max(abs(x - cx) - (size / 2.0 - corner_radius), 0)
                dy = max(abs(y - cy) - (size / 2.0 - corner_radius), 0)
                dist = math.sqrt(dx*dx + dy*dy)
                if dist <= corner_radius:
                    alpha = 255 if dist <= corner_radius - 1 else int(255 * (corner_radius - dist))
                    buffer[idx] = bg_r
                    buffer[idx+1] = bg_g
                    buffer[idx+2] = bg_b
                    buffer[idx+3] = max(0, min(255, alpha))
                else:
                    buffer[idx+3] = 0

    # Draw vibrant swirl arcs (blue, emerald, gold, crimson)
    # Safe zone scaling: maskable needs to stay within central 80%
    swirl_scale = (0.75 if is_maskable else 0.85) * (size / 512.0)
    
    def set_pixel(px, py, r, g, b, a_factor=1.0):
        if 0 <= px < size and 0 <= py < size:
            idx = (py * size + px) * 4
            existing_a = buffer[idx+3] / 255.0
            if existing_a > 0.01:
                # Alpha blend over background
                alpha = a_factor
                out_r = int(r * alpha + buffer[idx] * (1.0 - alpha))
                out_g = int(g * alpha + buffer[idx+1] * (1.0 - alpha))
                out_b = int(b * alpha + buffer[idx+2] * (1.0 - alpha))
                buffer[idx] = min(255, max(0, out_r))
                buffer[idx+1] = min(255, max(0, out_g))
                buffer[idx+2] = min(255, max(0, out_b))
                
    # Draw arcs
    arcs = [
        # Navy & Sky blue swirl
        {'color': (14, 165, 233), 'r_min': 100, 'r_max': 160, 'a_start': 0.8 * math.pi, 'a_end': 1.8 * math.pi, 'dr': 20},
        {'color': (56, 189, 248), 'r_min': 70, 'r_max': 130, 'a_start': 1.0 * math.pi, 'a_end': 1.7 * math.pi, 'dr': 15},
        # Emerald & lime green swoop
        {'color': (16, 185, 129), 'r_min': 80, 'r_max': 140, 'a_start': 0.3 * math.pi, 'a_end': 1.1 * math.pi, 'dr': 25},
        {'color': (132, 204, 22), 'r_min': 120, 'r_max': 150, 'a_start': 0.5 * math.pi, 'a_end': 0.9 * math.pi, 'dr': 15},
        # Warm gold & amber swoop
        {'color': (245, 158, 11), 'r_min': 50, 'r_max': 110, 'a_start': -0.2 * math.pi, 'a_end': 0.6 * math.pi, 'dr': 20},
        {'color': (250, 204, 21), 'r_min': 40, 'r_max': 80, 'a_start': 0.0 * math.pi, 'a_end': 0.5 * math.pi, 'dr': 15},
        # Crimson & ruby swoop
        {'color': (225, 29, 72), 'r_min': 80, 'r_max': 150, 'a_start': 1.5 * math.pi, 'a_end': 2.3 * math.pi, 'dr': 25},
        {'color': (244, 63, 94), 'r_min': 110, 'r_max': 160, 'a_start': 1.7 * math.pi, 'a_end': 2.2 * math.pi, 'dr': 18},
    ]

    for y in range(size):
        for x in range(size):
            dx = (x - cx) / swirl_scale
            dy = (y - cy) / swirl_scale
            r = math.sqrt(dx*dx + dy*dy)
            angle = math.atan2(dy, dx)
            if angle < 0:
                angle += 2 * math.pi
                
            for arc in arcs:
                c = arc['color']
                a_s = arc['a_start']
                a_e = arc['a_end']
                
                # Check angle in normal or wrapped range
                in_angle = False
                for shift in [-2*math.pi, 0, 2*math.pi]:
                    if a_s <= angle + shift <= a_e:
                        in_angle = True
                        break
                        
                if in_angle and (arc['r_min'] <= r <= arc['r_max']):
                    mid_r = (arc['r_min'] + arc['r_max']) / 2.0
                    thickness = (arc['r_max'] - arc['r_min']) / 2.0
                    dist_to_mid = abs(r - mid_r) / thickness
                    fade = max(0.0, 1.0 - dist_to_mid**2)
                    set_pixel(x, y, c[0], c[1], c[2], fade * 0.9)

    # Add dynamic droplets/dots
    dots = [
        (-150, -40, (14, 165, 233), 8),
        (-120, -100, (56, 189, 248), 6),
        (-100, 120, (16, 185, 129), 9),
        (-40, 140, (132, 204, 22), 7),
        (120, -80, (225, 29, 72), 9),
        (140, -40, (244, 63, 94), 7),
        (60, 100, (245, 158, 11), 8),
    ]
    for dot_x, dot_y, color, radius in dots:
        px = int(cx + dot_x * swirl_scale)
        py = int(cy + dot_y * swirl_scale)
        scaled_r = max(1, int(radius * swirl_scale))
        for dy in range(-scaled_r, scaled_r + 1):
            for dx in range(-scaled_r, scaled_r + 1):
                d = math.sqrt(dx*dx + dy*dy)
                if d <= scaled_r:
                    fade = max(0.0, 1.0 - (d / scaled_r)**2)
                    set_pixel(px + dx, py + dy, color[0], color[1], color[2], fade)

    return buffer

def main():
    os.makedirs('public', exist_ok=True)
    
    print("Generating 192x192 icon...")
    buf192 = draw_logo(192, is_maskable=False)
    png192 = create_png(192, 192, buf192)
    with open('public/pwa-192x192.png', 'wb') as f:
        f.write(png192)
        
    print("Generating 512x512 icon...")
    buf512 = draw_logo(512, is_maskable=False)
    png512 = create_png(512, 512, buf512)
    with open('public/pwa-512x512.png', 'wb') as f:
        f.write(png512)

    print("Generating 512x512 maskable icon...")
    buf_mask = draw_logo(512, is_maskable=True)
    png_mask = create_png(512, 512, buf_mask)
    with open('public/pwa-maskable-512x512.png', 'wb') as f:
        f.write(png_mask)

    print("Generating 180x180 apple touch icon...")
    buf180 = draw_logo(180, is_maskable=False)
    png180 = create_png(180, 180, buf180)
    with open('public/apple-touch-icon.png', 'wb') as f:
        f.write(png180)

    print("Generating 64x64 favicon...")
    buf64 = draw_logo(64, is_maskable=False)
    png64 = create_png(64, 64, buf64)
    with open('public/favicon.ico', 'wb') as f:
        f.write(png64)

    print("All PWA icons generated successfully!")

if __name__ == '__main__':
    main()
