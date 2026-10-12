import { Component } from '@angular/core';

/** Illustrated living room. The wall slowly cycles through paint colours. */
@Component({
  selector: 'app-room-art',
  standalone: true,
  template: `
    <svg viewBox="0 0 520 380" role="img" aria-label="A living room whose wall changes colour">
      <rect class="wall" x="0" y="0" width="520" height="290" />
      <rect x="0" y="290" width="520" height="90" fill="#c9a97f" />
      <rect x="0" y="282" width="520" height="10" fill="#ffffff" opacity=".9" />
      <!-- window -->
      <rect x="48" y="44" width="130" height="152" rx="6" fill="#ffffff" />
      <rect x="58" y="54" width="110" height="132" fill="#bfe3f5" />
      <path d="M58 54h110v52H58z" fill="#ddf1fb" opacity=".8" />
      <rect x="110" y="54" width="5" height="132" fill="#ffffff" />
      <rect x="58" y="116" width="110" height="5" fill="#ffffff" />
      <!-- picture frames -->
      <rect x="262" y="56" width="72" height="92" rx="3" fill="#ffffff" />
      <rect x="270" y="64" width="56" height="76" fill="#e9b44c" />
      <circle cx="298" cy="92" r="14" fill="#f4d58d" />
      <path d="M270 140l22-26 16 18 18-12v20z" fill="#d08a1d" />
      <rect x="350" y="78" width="62" height="62" rx="3" fill="#ffffff" />
      <rect x="357" y="85" width="48" height="48" fill="#2b3a55" />
      <circle cx="381" cy="109" r="12" fill="#e8b4b8" />
      <!-- rug -->
      <ellipse cx="340" cy="346" rx="175" ry="22" fill="#e8dfd0" />
      <!-- sofa -->
      <rect x="204" y="204" width="268" height="88" rx="22" fill="#2b3a55" />
      <rect x="190" y="246" width="296" height="58" rx="18" fill="#3a4d70" />
      <rect x="178" y="232" width="34" height="72" rx="14" fill="#2b3a55" />
      <rect x="464" y="232" width="34" height="72" rx="14" fill="#2b3a55" />
      <rect x="222" y="226" width="62" height="44" rx="12" fill="#e9b44c" />
      <rect x="398" y="226" width="62" height="44" rx="12" fill="#e8a598" />
      <rect x="206" y="304" width="9" height="16" rx="2" fill="#141b2a" />
      <rect x="462" y="304" width="9" height="16" rx="2" fill="#141b2a" />
      <!-- plant -->
      <path d="M50 304h46l-6 50H56z" fill="#c86b4b" />
      <ellipse cx="73" cy="272" rx="14" ry="34" fill="#4c8a5b" />
      <ellipse cx="52" cy="282" rx="12" ry="28" fill="#5fa06e" transform="rotate(-28 52 282)" />
      <ellipse cx="94" cy="282" rx="12" ry="28" fill="#3f7a4e" transform="rotate(28 94 282)" />
    </svg>
  `,
  styles: [`
    svg { display: block; width: 100%; height: auto; }
    .wall { animation: cycle 16s ease-in-out infinite; fill: #a8b8a0; }
    @keyframes cycle {
      0%, 100% { fill: #a8b8a0; }
      20% { fill: #4a90b8; }
      40% { fill: #e8b4b8; }
      60% { fill: #d9c3a0; }
      80% { fill: #b9a9d6; }
    }
  `],
})
export class RoomArtComponent {}
