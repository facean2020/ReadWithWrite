#!/usr/bin/env python3
"""
Theme Generator Script
Automatically generates src/index.css based on theme-config.py
Usage: python generate-theme.py
"""

import os
import importlib.util
from pathlib import Path

# Load theme_config module
config_path = os.path.join(os.path.dirname(__file__), 'theme-config.py')
spec = importlib.util.spec_from_file_location('theme_config', config_path)
config_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(config_module)
theme_config = config_module.theme_config


def clamp(value, min_value, max_value):
    return max(min_value, min(max_value, value))


def hex_to_rgb(hex_color):
    """Convert hex color to RGB dictionary."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 6:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return {'r': r, 'g': g, 'b': b}
    return None


def hex_to_rgb_tuple(hex_color: str):
    rgb = hex_to_rgb(hex_color)
    if not rgb:
        raise ValueError(f"Invalid hex color: {hex_color}")
    return rgb['r'], rgb['g'], rgb['b']


def rgb_to_hsl(r, g, b):
    """Convert RGB (0-255) to HSL dictionary (0..360, 0..100, 0..100)."""
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    max_val = max(r_norm, g_norm, b_norm)
    min_val = min(r_norm, g_norm, b_norm)
    h = s = 0
    l = (max_val + min_val) / 2.0

    if max_val != min_val:
        d = max_val - min_val
        s = d / (2 - max_val - min_val) if l > 0.5 else d / (max_val + min_val)
        if max_val == r_norm:
            h = ((g_norm - b_norm) / d + (6 if g_norm < b_norm else 0)) / 6.0
        elif max_val == g_norm:
            h = ((b_norm - r_norm) / d + 2) / 6.0
        elif max_val == b_norm:
            h = ((r_norm - g_norm) / d + 4) / 6.0

    return {
        'h': round(h * 360),
        's': round(s * 100),
        'l': round(l * 100)
    }


def hsl_to_hex(h: int, s: int, l: int) -> str:
    """Convert HSL (0..360, 0..100, 0..100) to hex."""
    h_norm = (h % 360) / 360.0
    s_norm = clamp(s, 0, 100) / 100.0
    l_norm = clamp(l, 0, 100) / 100.0

    if s_norm == 0:
        val = int(round(l_norm * 255))
        return f"#{val:02x}{val:02x}{val:02x}"

    def hue_to_rgb(p, q, t):
        if t < 0: t += 1
        if t > 1: t -= 1
        if t < 1 / 6: return p + (q - p) * 6 * t
        if t < 1 / 2: return q
        if t < 2 / 3: return p + (q - p) * (2 / 3 - t) * 6
        return p

    q = l_norm * (1 + s_norm) if l_norm < 0.5 else l_norm + s_norm - l_norm * s_norm
    p = 2 * l_norm - q
    r = hue_to_rgb(p, q, h_norm + 1 / 3)
    g = hue_to_rgb(p, q, h_norm)
    b = hue_to_rgb(p, q, h_norm - 1 / 3)
    return f"#{int(round(r * 255)):02x}{int(round(g * 255)):02x}{int(round(b * 255)):02x}"


def mix_hex(a: str, b: str, t: float) -> str:
    """Linear mix between two hex colors in RGB space. t=0 -> a, t=1 -> b"""
    t = clamp(t, 0.0, 1.0)
    ar, ag, ab = hex_to_rgb_tuple(a)
    br, bg, bb = hex_to_rgb_tuple(b)
    r = round(ar + (br - ar) * t)
    g = round(ag + (bg - ag) * t)
    b_ = round(ab + (bb - ab) * t)
    return f"#{r:02x}{g:02x}{b_:02x}"


def hsl_to_css_triplet(hsl: dict) -> str:
    return f"{hsl['h']} {hsl['s']}% {hsl['l']}%"


def hex_to_hsl_css_triplet(hex_color: str) -> str:
    r, g, b = hex_to_rgb_tuple(hex_color)
    return hsl_to_css_triplet(rgb_to_hsl(r, g, b))


def generate_derived_colors(bg_primary, bg_secondary, text_primary, is_dark=False):
    """Generate shadcn/tailwind token variables as HSL triplets."""
    if is_dark:
        muted = mix_hex(bg_secondary, text_primary, 0.10)
        border = mix_hex(bg_secondary, text_primary, 0.15)
        muted_foreground = mix_hex(text_primary, bg_secondary, 0.45)

        return {
            'background': hex_to_hsl_css_triplet(bg_primary),
            'foreground': hex_to_hsl_css_triplet(text_primary),
            'card': hex_to_hsl_css_triplet(bg_secondary),
            'cardForeground': hex_to_hsl_css_triplet(text_primary),
            'popover': hex_to_hsl_css_triplet(bg_secondary),
            'popoverForeground': hex_to_hsl_css_triplet(text_primary),
            'primary': hex_to_hsl_css_triplet(text_primary),
            'primaryForeground': hex_to_hsl_css_triplet(bg_primary),
            'secondary': hex_to_hsl_css_triplet(bg_secondary),
            'secondaryForeground': hex_to_hsl_css_triplet(text_primary),
            'muted': hex_to_hsl_css_triplet(muted),
            'mutedForeground': hex_to_hsl_css_triplet(muted_foreground),
            'accent': hex_to_hsl_css_triplet(bg_secondary),
            'accentForeground': hex_to_hsl_css_triplet(text_primary),
            'destructive': hex_to_hsl_css_triplet('#7f1d1d'),
            'destructiveForeground': hex_to_hsl_css_triplet('#ffffff'),
            'border': hex_to_hsl_css_triplet(border),
            'input': hex_to_hsl_css_triplet(border),
            'ring': hex_to_hsl_css_triplet(bg_secondary),
        }

    muted = mix_hex(bg_primary, bg_secondary, 0.35)
    border = mix_hex(bg_primary, text_primary, 0.12)
    muted_foreground = mix_hex(text_primary, bg_primary, 0.45)

    return {
        'background': hex_to_hsl_css_triplet(bg_primary),
        'foreground': hex_to_hsl_css_triplet(text_primary),
        'card': hex_to_hsl_css_triplet(bg_secondary),
        'cardForeground': hex_to_hsl_css_triplet(text_primary),
        'popover': hex_to_hsl_css_triplet(bg_secondary),
        'popoverForeground': hex_to_hsl_css_triplet(text_primary),
        'primary': hex_to_hsl_css_triplet(text_primary),
        'primaryForeground': hex_to_hsl_css_triplet(bg_primary),
        'secondary': hex_to_hsl_css_triplet(bg_secondary),
        'secondaryForeground': hex_to_hsl_css_triplet(text_primary),
        'muted': hex_to_hsl_css_triplet(muted),
        'mutedForeground': hex_to_hsl_css_triplet(muted_foreground),
        'accent': hex_to_hsl_css_triplet(bg_secondary),
        'accentForeground': hex_to_hsl_css_triplet(text_primary),
        'destructive': hex_to_hsl_css_triplet('#dc2626'),
        'destructiveForeground': hex_to_hsl_css_triplet('#ffffff'),
        'border': hex_to_hsl_css_triplet(border),
        'input': hex_to_hsl_css_triplet(border),
        'ring': hex_to_hsl_css_triplet(bg_secondary),
    }


def generate_css():
    """Generate complete src/index.css."""
    light_colors = generate_derived_colors(
        theme_config['light']['bgPrimary'],
        theme_config['light']['bgSecondary'],
        theme_config['light']['textPrimary'],
        False
    )

    dark_colors = generate_derived_colors(
        theme_config['dark']['bgPrimary'],
        theme_config['dark']['bgSecondary'],
        theme_config['dark']['textPrimary'],
        True
    )

    css_content = f"""@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Variables (Simple Hex for convenience) */
:root {{
  --bg-primary: {theme_config['light']['bgPrimary']};
  --bg-secondary: {theme_config['light']['bgSecondary']};
  --text-primary: {theme_config['light']['textPrimary']};
  
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: var(--text-primary);
  background-color: var(--bg-primary);
  color-scheme: light;
}}

[data-theme="dark"] {{
  --bg-primary: {theme_config['dark']['bgPrimary']};
  --bg-secondary: {theme_config['dark']['bgSecondary']};
  --text-primary: {theme_config['dark']['textPrimary']};
  
  color: var(--text-primary);
  background-color: var(--bg-primary);
  color-scheme: dark;
}}

body {{
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}}

a {{
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}}
a:hover {{
  color: #535bf2;
}}

@layer base {{
  /* Shadcn/Tailwind Tokens (HSL triplets) */
  :root {{
    --background: {light_colors['background']};
    --foreground: {light_colors['foreground']};
    --card: {light_colors['card']};
    --card-foreground: {light_colors['cardForeground']};
    --popover: {light_colors['popover']};
    --popover-foreground: {light_colors['popoverForeground']};
    --primary: {light_colors['primary']};
    --primary-foreground: {light_colors['primaryForeground']};
    --secondary: {light_colors['secondary']};
    --secondary-foreground: {light_colors['secondaryForeground']};
    --muted: {light_colors['muted']};
    --muted-foreground: {light_colors['mutedForeground']};
    --accent: {light_colors['accent']};
    --accent-foreground: {light_colors['accentForeground']};
    --destructive: {light_colors['destructive']};
    --destructive-foreground: {light_colors['destructiveForeground']};
    --border: {light_colors['border']};
    --input: {light_colors['input']};
    --ring: {light_colors['ring']};
    --radius: 0.5rem;
  }}

  [data-theme="dark"] {{
    --background: {dark_colors['background']};
    --foreground: {dark_colors['foreground']};
    --card: {dark_colors['card']};
    --card-foreground: {dark_colors['cardForeground']};
    --popover: {dark_colors['popover']};
    --popover-foreground: {dark_colors['popoverForeground']};
    --primary: {dark_colors['primary']};
    --primary-foreground: {dark_colors['primaryForeground']};
    --secondary: {dark_colors['secondary']};
    --secondary-foreground: {dark_colors['secondaryForeground']};
    --muted: {dark_colors['muted']};
    --muted-foreground: {dark_colors['mutedForeground']};
    --accent: {dark_colors['accent']};
    --accent-foreground: {dark_colors['accentForeground']};
    --destructive: {dark_colors['destructive']};
    --destructive-foreground: {dark_colors['destructiveForeground']};
    --border: {dark_colors['border']};
    --input: {dark_colors['input']};
    --ring: {dark_colors['ring']};
  }}

  * {{
    @apply border-border;
  }}
  body {{
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }}
}}
"""
    script_dir = Path(__file__).parent.parent
    output_path = script_dir / 'src' / 'index.css'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print(f'✓ Theme configuration generated: {output_path}')


def main():
    try:
        generate_css()
        print('✓ Complete! Edit color values in theme-config.py and rerun.')
    except Exception as e:
        print(f'✗ Generation failed: {e}')
        import traceback
        traceback.print_exc()
        exit(1)


if __name__ == '__main__':
    main()
