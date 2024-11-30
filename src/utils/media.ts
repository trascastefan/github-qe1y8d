import { useTheme } from '../hooks/useTheme';
import { useEffect, useState, useRef } from 'react';

interface ImageMetadata {
  brightness: number;
  contrast: number;
  hasTransparency: boolean;
}

type ImageTheme = 'light' | 'dark' | 'auto';

interface DarkModeImageProps {
  src: string;
  darkSrc?: string;
  alt: string;
  className?: string;
  theme?: ImageTheme;
  preserveContrast?: boolean;
}

// Analyze image characteristics
async function analyzeImage(src: string): Promise<ImageMetadata> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ brightness: 0.5, contrast: 0.5, hasTransparency: false });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let brightness = 0;
      let contrast = 0;
      let hasTransparency = false;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 255) hasTransparency = true;

        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        brightness += luminance;
      }

      brightness = brightness / (data.length / 4);
      
      resolve({
        brightness,
        contrast: 0.5, // Default contrast
        hasTransparency
      });
    };

    img.onerror = () => {
      resolve({ brightness: 0.5, contrast: 0.5, hasTransparency: false });
    };

    img.src = src;
  });
}

export function DarkModeImage({
  src,
  darkSrc,
  alt,
  className = '',
  theme = 'auto',
  preserveContrast = false
}: DarkModeImageProps) {
  const { isDark } = useTheme();
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [filter, setFilter] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let isMounted = true;

    const analyze = async () => {
      const metadata = await analyzeImage(src);
      if (isMounted) {
        setImageMetadata(metadata);
      }
    };

    analyze();

    return () => {
      isMounted = false;
    };
  }, [src]);

  useEffect(() => {
    if (!imageMetadata) return;

    if (isDark && !darkSrc) {
      const { brightness, hasTransparency } = imageMetadata;
      
      if (theme === 'light' || (theme === 'auto' && brightness > 0.7)) {
        // Light image in dark mode
        setFilter(
          preserveContrast
            ? 'brightness(0.85) contrast(1.1) saturate(1.2)'
            : 'brightness(0.8) contrast(1.2)'
        );
      } else if (hasTransparency) {
        // Transparent image
        setFilter('brightness(0.9)');
      } else {
        // Regular image
        setFilter('brightness(0.95)');
      }
    } else {
      setFilter('');
    }
  }, [isDark, imageMetadata, darkSrc, theme, preserveContrast]);

  if (darkSrc && isDark) {
    return (
      <picture>
        <source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`${className} transition-[filter] duration-200`}
          style={{ filter }}
          loading="lazy"
        />
      </picture>
    );
  }

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={`${className} transition-[filter] duration-200`}
      style={{ filter }}
      loading="lazy"
    />
  );
}
