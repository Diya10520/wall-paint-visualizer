import { Injectable } from '@angular/core';

export interface Pt { x: number; y: number; }
export interface Wall {
  points: Pt[];
  colorHex: string;
  colorName?: string;
  opacity: number;
  finish: 'matte' | 'glossy';
}

/** Holds the room being edited while the user moves between pages. */
@Injectable({ providedIn: 'root' })
export class StateService {
  file: File | null = null;       // new upload (not saved yet)
  imageUrl = '';                  // blob URL (new) or server URL (saved project)
  projectId: string | null = null;
  projectName = 'My room';
  walls: Wall[] = [];

  reset() {
    this.file = null; this.imageUrl = ''; this.projectId = null;
    this.projectName = 'My room'; this.walls = [];
  }

  loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';           // needed so the canvas can be downloaded
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = url;
    });
  }

  /** Working size of the canvas: max 1200px wide. Same rule is used everywhere,
   *  so saved polygon coordinates always line up with the picture. */
  size(img: HTMLImageElement) {
    const s = Math.min(1, 1200 / img.naturalWidth);
    return { w: Math.round(img.naturalWidth * s), h: Math.round(img.naturalHeight * s) };
  }
}
