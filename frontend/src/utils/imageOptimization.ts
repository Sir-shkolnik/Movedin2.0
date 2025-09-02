// Image Optimization Utilities

// Check if browser supports WebP
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Get optimal image format
export function getOptimalImageFormat(): 'webp' | 'jpeg' | 'png' {
  // This will be set by the supportsWebP function
  return 'webp'; // Default to WebP, fallback handled by CSS
}

// Generate responsive image srcset
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string {
  return widths
    .map(width => `${baseUrl}?w=${width}&f=${format} ${width}w`)
    .join(', ');
}

// Generate responsive image sizes
export function generateSizes(
  breakpoints: { [key: string]: string } = {
    '320px': '100vw',
    '640px': '50vw',
    '1024px': '33vw',
    '1920px': '25vw'
  }
): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}`)
    .join(', ');
}

// Lazy loading utility
export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    loadAllImages();
  }
}

// Load individual image
function loadImage(img: HTMLImageElement) {
  const src = img.getAttribute('data-src');
  const srcset = img.getAttribute('data-srcset');
  const sizes = img.getAttribute('data-sizes');
  
  if (src) {
    img.src = src;
    img.removeAttribute('data-src');
  }
  
  if (srcset) {
    img.srcset = srcset;
    img.removeAttribute('data-srcset');
  }
  
  if (sizes) {
    img.sizes = sizes;
    img.removeAttribute('data-sizes');
  }
  
  img.classList.remove('lazy');
  img.classList.add('loaded');
}

// Fallback: load all images
function loadAllImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => loadImage(img as HTMLImageElement));
}

// Create optimized image element
export function createOptimizedImage(
  src: string,
  alt: string,
  className: string = '',
  lazy: boolean = true
): HTMLImageElement {
  const img = document.createElement('img');
  img.alt = alt;
  img.className = className;
  
  if (lazy) {
    img.classList.add('lazy');
    img.setAttribute('data-src', src);
    
    // Add loading placeholder
    img.style.filter = 'blur(5px)';
    img.style.transition = 'filter 0.3s ease';
    
    img.onload = () => {
      img.style.filter = 'blur(0)';
    };
  } else {
    img.src = src;
  }
  
  return img;
}

// Image compression utility
export function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Generate WebP image with fallback
export function generateWebPWithFallback(
  webpUrl: string,
  fallbackUrl: string,
  alt: string,
  className: string = ''
): string {
  return `
    <picture>
      <source srcset="${webpUrl}" type="image/webp">
      <img src="${fallbackUrl}" alt="${alt}" class="${className}">
    </picture>
  `;
}

// Preload critical images
export function preloadCriticalImages(urls: string[]) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Generate placeholder image
export function generatePlaceholder(
  width: number,
  height: number,
  text: string = 'Loading...',
  backgroundColor: string = '#f3f4f6',
  textColor: string = '#6b7280'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = width;
  canvas.height = height;
  
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.font = '16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
}

// Image error handling
export function handleImageError(img: HTMLImageElement, fallbackSrc: string) {
  img.onerror = () => {
    img.src = fallbackSrc;
    img.onerror = null; // Prevent infinite loop
  };
}

// Responsive image component props
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  sizes?: string;
  srcSet?: string;
  placeholder?: string;
  fallback?: string;
}

// Create responsive image component
export function createResponsiveImage(props: ResponsiveImageProps): HTMLImageElement {
  const img = document.createElement('img');
  
  img.alt = props.alt;
  img.className = props.className || '';
  
  if (props.lazy) {
    img.classList.add('lazy');
    img.setAttribute('data-src', props.src);
    
    if (props.srcSet) {
      img.setAttribute('data-srcset', props.srcSet);
    }
    
    if (props.sizes) {
      img.setAttribute('data-sizes', props.sizes);
    }
    
    if (props.placeholder) {
      img.src = props.placeholder;
    }
  } else {
    img.src = props.src;
    
    if (props.srcSet) {
      img.srcset = props.srcSet;
    }
    
    if (props.sizes) {
      img.sizes = props.sizes;
    }
  }
  
  // Add error handling
  if (props.fallback) {
    handleImageError(img, props.fallback);
  }
  
  return img;
}

// Initialize image optimization
export function initializeImageOptimization() {
  // Setup lazy loading
  setupLazyLoading();
  
  // Preload critical images
  const criticalImages = [
    '/icon-192x192.png',
    '/icon-512x512.png'
  ];
  preloadCriticalImages(criticalImages);
  
  console.log('Image optimization initialized');
}
