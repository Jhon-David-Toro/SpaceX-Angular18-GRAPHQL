import { Component, computed, inject, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeResourceUrl } from '@angular/platform-browser';

/**
 * Lightweight YouTube embed: shows the thumbnail and only loads the player (≈1 MB of JS)
 * when the viewer asks for it. Uses the privacy-enhanced domain.
 */
@Component({
  selector: 'app-video-facade',
  imports: [NgOptimizedImage],
  template: `
    @if (playing()) {
      <iframe
        [src]="embedUrl()"
        [title]="'Vídeo: ' + title()"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    } @else {
      <button type="button" (click)="playing.set(true)">
        <img [ngSrc]="thumbnail()" fill sizes="(width < 60rem) 100vw, 60rem" alt="" />
        <span class="play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          Reproducir el vídeo del lanzamiento
        </span>
      </button>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border-radius: var(--radius-media);
      background: var(--sky-2);
    }
    iframe,
    button {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      border: 0;
      padding: 0;
      background: none;
    }
    img {
      object-fit: cover;
      filter: saturate(0.85);
    }
    .play {
      position: absolute;
      inset-inline-start: var(--space-s);
      inset-block-end: var(--space-s);
      display: inline-flex;
      align-items: center;
      gap: var(--space-2xs);
      padding: 0.6rem 1rem 0.6rem 0.75rem;
      border-radius: var(--radius-control);
      background: var(--foil);
      color: var(--on-foil);
      font-weight: 700;
      svg {
        inline-size: 1.3rem;
        fill: currentColor;
      }
    }
  `,
})
export class VideoFacade {
  private readonly sanitizer = inject(DomSanitizer);

  /** Validated 11-character YouTube id (see `youtubeId`). */
  readonly videoId = input.required<string>();
  readonly title = input.required<string>();

  protected readonly playing = signal(false);
  protected readonly thumbnail = computed(
    () => `https://i.ytimg.com/vi/${this.videoId()}/hqdefault.jpg`,
  );
  protected readonly embedUrl = computed<SafeResourceUrl>(() =>
    // Safe: the id is validated against /^[\w-]{11}$/ before reaching this component.
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId())}?autoplay=1&rel=0`,
    ),
  );
}
