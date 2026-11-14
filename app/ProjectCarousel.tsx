'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowUpRight,
  Sparkles,
  Maximize2,
  X,
  Play,
  Pause,
  ArrowLeft,
} from 'lucide-react';
import type { Project } from './projects';

interface CardCarouselProps {
  project: Project;
  featured?: boolean;
}

export function CardCarousel({ project, featured = false }: CardCarouselProps) {
  const isMobile = project.type === 'Mobile';
  const images = project.images ?? [];
  const imagesPerPage = isMobile ? 2 : 1;

  // Chunk images into sets of 2 for mobile, 1 for web
  const pages = useMemo(() => {
    if (!images.length) return [];
    const chunks: string[][] = [];
    for (let i = 0; i < images.length; i += imagesPerPage) {
      chunks.push(images.slice(i, i + imagesPerPage));
    }
    return chunks;
  }, [images, imagesPerPage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play timer with slight stagger per project id to avoid synchronized flips
  useEffect(() => {
    if (pages.length <= 1 || isPaused) return;

    const baseDuration = 3600;
    const stagger = (project.id % 4) * 300;
    const intervalTime = baseDuration + stagger;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % pages.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [pages.length, isPaused, project.id]);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (pages.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % pages.length);
  }, [pages.length]);

  const goToPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (pages.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + pages.length) % pages.length);
  }, [pages.length]);

  const goToPage = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      goToNext();
    } else if (diff < -40) {
      goToPrev();
    }
    touchStartX.current = null;
  };

  // If project has no screenshots, render the original stylized art mark
  if (!images.length || !pages.length) {
    return (
      <div className={`project-art art-${project.id}`} aria-hidden="true">
        <div className="art-orb" />
        <span>{project.mark}</span>
      </div>
    );
  }

  const currentProgressPercent = ((currentIndex + 1) / pages.length) * 100;

  return (
    <div
      className={`card-carousel-container ${isMobile ? 'type-mobile' : 'type-web'} ${featured ? 'is-featured' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={`${project.title} screenshot carousel`}
    >
      {/* Background ambient effect */}
      <div className="carousel-ambient-glow" />
      <div className="carousel-grid-overlay" />

      {/* Carousel Track */}
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {pages.map((page, pageIdx) => {
          // Preload only adjacent slides
          const isAdjacent = Math.abs(pageIdx - currentIndex) <= 1 || pageIdx === 0;

          return (
            <div className="carousel-slide" key={pageIdx}>
              {isMobile ? (
                <div className={`mobile-screens-set ${page.length === 1 ? 'single-screen' : 'paired-screens'}`}>
                  {page.map((imgSrc, imgSubIdx) => (
                    <div className="mobile-phone-frame" key={imgSrc}>
                      <div className="phone-screen">
                        {isAdjacent ? (
                          <img
                            src={imgSrc}
                            alt={`${project.title} screen ${pageIdx * imagesPerPage + imgSubIdx + 1}`}
                            loading="lazy"
                            className="phone-img"
                          />
                        ) : (
                          <div className="phone-placeholder" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="web-screen-wrap">
                  <div className="web-browser-frame">
                    <div className="browser-header">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                      <span className="browser-url">
                        {project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.app
                      </span>
                    </div>
                    <div className="browser-screen">
                      {isAdjacent ? (
                        <img
                          src={page[0]}
                          alt={`${project.title} view ${pageIdx + 1}`}
                          loading="lazy"
                          className="web-img"
                        />
                      ) : (
                        <div className="web-placeholder" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (visible on hover or focus) */}
      {pages.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-nav-btn prev"
            onClick={goToPrev}
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="carousel-nav-btn next"
            onClick={goToNext}
            aria-label="Next screenshot"
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Pagination Controls */}
      {pages.length > 1 && (
        <>
          {pages.length <= 6 ? (
            <div className="carousel-dots" onClick={(e) => e.stopPropagation()}>
              {pages.map((_, dotIdx) => (
                <button
                  type="button"
                  key={dotIdx}
                  className={`carousel-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => goToPage(dotIdx, e)}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          ) : (
            <div className="carousel-counter-badge" onClick={(e) => e.stopPropagation()}>
              <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="counter-sep">/</span>
              <span>{String(pages.length).padStart(2, '0')}</span>
            </div>
          )}

          {/* Thin progress bar line */}
          <div className="carousel-progress-track">
            <div
              className="carousel-progress-bar"
              style={{ width: `${currentProgressPercent}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Panel shown inside the card when user touches "Stack & Details" tab
 */
interface CardDetailsPanelProps {
  project: Project;
  featured?: boolean;
  onOpenModal: () => void;
}

export function CardDetailsPanel({ project, featured = false, onOpenModal }: CardDetailsPanelProps) {
  return (
    <div
      className={`card-details-panel ${featured ? 'is-featured' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="card-details-scroll">
        {/* Tech Stack section */}
        <div className="details-section">
          <div className="details-kicker-row">
            <span className="details-kicker">TECHNOLOGY STACK</span>
            <span className="details-count">{project.stack.length} technologies</span>
          </div>
          <div className="details-stack-tags">
            {project.stack.length > 0 ? (
              project.stack.map(tag => (
                <span className="details-stack-tag" key={tag}>{tag}</span>
              ))
            ) : (
              <span className="details-stack-empty">Full-Stack Architecture & DB Design</span>
            )}
          </div>
        </div>

        {/* Project Details / Workflows section */}
        <div className="details-section">
          <div className="details-kicker-row">
            <span className="details-kicker">KEY WORKFLOWS & DETAILS</span>
            <span className="details-count">{project.details.length} features</span>
          </div>
          <ul className="details-bullet-list">
            {project.details.map((detail, idx) => (
              <li key={idx} className="details-bullet-item">
                <span className="details-bullet-icon">✳</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer link to open modal */}
      <div className="card-details-footer">
        <button
          type="button"
          className="card-details-expand-btn"
          onClick={onOpenModal}
          aria-label="Open full popup modal with zoomable screenshots"
        >
          <span>Open Full Preview & Zoom Screenshots</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

interface ModalGalleryProps {
  project: Project;
}

export function ModalGallery({ project }: ModalGalleryProps) {
  const images = project.images ?? [];
  const isMobile = project.type === 'Mobile';
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Auto-swap images in popup modal (3.8 seconds duration)
  useEffect(() => {
    if (images.length <= 1 || isPaused || !isPlaying || lightboxOpen) return;

    const intervalTime = 3800;
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [images.length, isPaused, isPlaying, lightboxOpen]);

  // Keep active thumbnail centered in thumbnail strip when auto-swapping
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeBtn = thumbnailStripRef.current.children[activeIdx] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeIdx]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!images.length) return;
    setActiveIdx(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!images.length) return;
    setActiveIdx(prev => (prev + 1) % images.length);
  }, [images.length]);

  const openLightbox = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIdx(index);
    setLightboxOpen(true);
    setIsPaused(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextImage();
    } else if (diff < -45) {
      prevImage();
    } else if (Math.abs(diff) < 10) {
      // Tap on image opens full-screen zoom popup modal
      openLightbox(activeIdx);
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation for modal gallery (when lightbox is closed)
  useEffect(() => {
    if (lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, lightboxOpen]);

  // Fallback if no images
  if (!images.length) {
    return (
      <div className={`modal-art art-${project.id}`}>
        <span>{project.mark}</span>
      </div>
    );
  }

  const currentImage = images[activeIdx] || images[0];

  return (
    <>
      <div
        className={`modal-gallery-wrap ${isMobile ? 'is-mobile' : 'is-web'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="modal-gallery-viewport">
          {/* Top toolbar with Counter, Play/Pause, and Zoom/Inspect button */}
          <div className="modal-gallery-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-counter">
              <span>{activeIdx + 1}</span> / <span>{images.length}</span>
            </div>

            <div className="modal-gallery-actions">
              {images.length > 1 && (
                <button
                  type="button"
                  className="modal-tool-btn play-pause-btn"
                  onClick={() => setIsPlaying(prev => !prev)}
                  title={isPlaying ? 'Pause auto-swap' : 'Resume auto-swap'}
                  aria-label={isPlaying ? 'Pause auto-swap' : 'Resume auto-swap'}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
              )}

              <button
                type="button"
                className="modal-tool-btn expand-lightbox-btn"
                onClick={(e) => openLightbox(activeIdx, e)}
                title="Touch or click to open full-screen zoom popup modal"
                aria-label="Touch or click to open full-screen zoom popup modal"
              >
                <Maximize2 size={13} />
                <span className="expand-btn-text">Tap to Zoom</span>
              </button>
            </div>
          </div>

          {/* Main Display Frame (clicking or touching opens the second popup modal) */}
          {isMobile ? (
            <div className="modal-phone-container">
              <div
                className="modal-phone-frame modal-interactive-frame"
                onClick={() => openLightbox(activeIdx)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="button"
                tabIndex={0}
                aria-label={`View screen ${activeIdx + 1} in zoom popup modal`}
                title="Touch or click to open in zoom popup modal"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(activeIdx);
                  }
                }}
              >
                <img
                  src={currentImage}
                  alt={`${project.title} preview ${activeIdx + 1}`}
                  className="modal-phone-img"
                  draggable={false}
                />
                <div className="modal-touch-expand-badge">
                  <Maximize2 size={12} />
                  <span>Tap image to zoom</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-web-container">
              <div
                className="modal-web-frame modal-interactive-frame"
                onClick={() => openLightbox(activeIdx)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="button"
                tabIndex={0}
                aria-label={`View web screen ${activeIdx + 1} in zoom popup modal`}
                title="Touch or click to open in zoom popup modal"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(activeIdx);
                  }
                }}
              >
                <div className="modal-browser-header">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="modal-browser-url">
                    https://{project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.app
                  </span>
                </div>
                <div className="modal-web-screen">
                  <img
                    src={currentImage}
                    alt={`${project.title} preview ${activeIdx + 1}`}
                    className="modal-web-img"
                    draggable={false}
                  />
                  <div className="modal-touch-expand-badge">
                    <Maximize2 size={12} />
                    <span>Tap image to zoom</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Prev / Next Buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="modal-nav-btn prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="modal-nav-btn next"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Auto-play Progress Line */}
          {images.length > 1 && isPlaying && !isPaused && (
            <div className="modal-progress-track">
              <div
                key={activeIdx}
                className="modal-progress-bar-animated"
              />
            </div>
          )}
        </div>

        {/* Thumbnails filmstrip */}
        {images.length > 1 && (
          <div className="modal-thumbnail-strip" ref={thumbnailStripRef}>
            {images.map((img, idx) => (
              <button
                type="button"
                key={img}
                className={`modal-thumb-btn ${idx === activeIdx ? 'active' : ''} ${isMobile ? 'thumb-mobile' : 'thumb-web'}`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECOND POPUP MODAL: Fullscreen Zoomable Image Lightbox */}
      {lightboxOpen && (
        <ImageLightboxModal
          images={images}
          initialIdx={lightboxIdx}
          projectTitle={project.title}
          projectType={project.type}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

/**
 * SECOND POPUP MODAL: Full-screen Zoomable Image Lightbox
 * Opens when touching/clicking any screenshot in the project modal.
 */
interface ImageLightboxModalProps {
  images: string[];
  initialIdx: number;
  projectTitle: string;
  projectType: 'Mobile' | 'Web';
  onClose: () => void;
}

export function ImageLightboxModal({
  images,
  initialIdx,
  projectTitle,
  projectType,
  onClose,
}: ImageLightboxModalProps) {
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const isMobile = projectType === 'Mobile';

  // Prevent background scrolling while lightbox is active
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Reset zoom & pan when active image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [activeIdx]);

  // Keep active thumbnail centered in thumbnail strip
  useEffect(() => {
    if (thumbStripRef.current) {
      const activeThumb = thumbStripRef.current.children[activeIdx] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIdx]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    setActiveIdx(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    if (!images.length) return;
    setActiveIdx(prev => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === '+' || e.key === '=') {
        setZoom(prev => Math.min(4, Math.round((prev + 0.5) * 10) / 10));
      }
      if (e.key === '-' || e.key === '_') {
        setZoom(prev => {
          const next = Math.max(1, Math.round((prev - 0.5) * 10) / 10);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      }
      if (e.key === '0') {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, onClose]);

  // Zoom controls
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(prev => Math.min(4, Math.round((prev + 0.5) * 10) / 10));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(prev => {
      const next = Math.max(1, Math.round((prev - 0.5) * 10) / 10);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoom === 1) {
      setZoom(2.2);
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Wheel zoom in lightbox
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(4, Math.round((prev + 0.25) * 100) / 100));
    } else {
      setZoom(prev => {
        const next = Math.max(1, Math.round((prev - 0.25) * 100) / 100);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse pan drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan & pinch & swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
    } else if (e.touches.length === 1) {
      if (zoom > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        };
      } else {
        touchStartXRef.current = e.touches[0].clientX;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDistRef.current;
      setZoom(prev => Math.min(4, Math.max(1, Math.round(prev * ratio * 10) / 10)));
      touchStartDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPan({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    touchStartDistRef.current = null;
    if (zoom === 1 && touchStartXRef.current !== null) {
      const diff = touchStartXRef.current - e.changedTouches[0].clientX;
      if (diff > 45) {
        nextImage();
      } else if (diff < -45) {
        prevImage();
      }
    }
    touchStartXRef.current = null;
  };

  const currentImage = images[activeIdx] || images[0];

  return (
    <div
      className="image-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} fullscreen image viewer`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Lightbox Top Bar */}
      <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-title-area">
          <button
            type="button"
            className="lightbox-back-btn"
            onClick={onClose}
            aria-label="Return to project details"
          >
            <ArrowLeft size={14} />
            <span>Project Details</span>
          </button>
          <div className="lightbox-project-badge">
            <span className="lightbox-title-text">{projectTitle}</span>
            <span className="lightbox-divider">·</span>
            <span className="lightbox-counter">
              Screen {String(activeIdx + 1).padStart(2, '0')} of {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Zoom Controls & Close Button */}
        <div className="lightbox-controls-area">
          <div className="lightbox-zoom-toolbar">
            <button
              type="button"
              className="zoom-tool-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              aria-label="Zoom out"
              title="Zoom out (-)"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              className="zoom-level-badge"
              onClick={handleResetZoom}
              title="Click to reset zoom (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="zoom-tool-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              aria-label="Zoom in"
              title="Zoom in (+)"
            >
              <ZoomIn size={15} />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                className="zoom-tool-btn reset-btn"
                onClick={handleResetZoom}
                aria-label="Reset zoom"
                title="Reset zoom (0)"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="lightbox-close-btn"
            onClick={onClose}
            aria-label="Close fullscreen view"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        className="lightbox-main-viewport"
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && zoom === 1) onClose();
        }}
      >
        <div
          className={`lightbox-image-stage ${isMobile ? 'is-mobile' : 'is-web'}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleToggleZoom}
        >
          <div
            className="lightbox-zoom-wrapper"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            }}
          >
            <img
              src={currentImage}
              alt={`${projectTitle} fullscreen screen ${activeIdx + 1}`}
              className={isMobile ? 'lightbox-img-phone' : 'lightbox-img-web'}
              draggable={false}
            />
          </div>
        </div>

        {/* Previous & Next Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous screen"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next screen"
              title="Next (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Floating Zoom / Pan instruction hint */}
        <div className="lightbox-hint-badge">
          {zoom > 1 ? 'Drag to pan · Double-click to reset' : 'Click / Double-click to zoom · Scroll wheel to zoom in/out'}
        </div>
      </div>

      {/* Lightbox Bottom Thumbnails Strip */}
      {images.length > 1 && (
        <div className="lightbox-bottom-bar" onClick={(e) => e.stopPropagation()}>
          <div className="lightbox-thumbnails-strip" ref={thumbStripRef}>
            {images.map((img, idx) => (
              <button
                type="button"
                key={img}
                className={`lightbox-thumb-btn ${idx === activeIdx ? 'active' : ''} ${isMobile ? 'thumb-phone' : 'thumb-web'}`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Jump to screen ${idx + 1}`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
