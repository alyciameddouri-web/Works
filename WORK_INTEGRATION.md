# Work Experience — Integration Guide

This guide provides instructions for extracting and integrating the **Active Theory 3D Work Experience** into any React application (Vite, Next.js, Create React App, etc.).

---

## 1. Overview

The Work Experience is a standalone, high-performance WebGL/Frag3D interactive showcase featuring:
- **Interactive 3D Spiral / Helix**: Kinetic project cards with real-time mouse fluid tracking and momentum scrolling.
- **Glass / Refraction Shaders**: Dynamic chromatic aberration, Fresnel reflections, and frosted glass distortion.
- **Case Study Transitions**: Cinematic camera tweening, particle dissipation, 3D typography, and video textures.
- **Modal & Media System**: Responsive interactive video modal, full-screen playback, and case study links.
- **Fully Decoupled Data & Routing**: Configure base routes (`/works`, `/work`, `/portfolio`) and pass custom project data via props or JSON.

---

## 2. Minimum Portable Package (Exact File Manifest)

### COPY THESE:

#### 1. React Application Code (`src/`)
```
src/
└── work/
    ├── index.ts                      # Module entry point
    ├── WorkExperience.tsx            # Main React component (auto-imports work.css)
    ├── work.css                      # WebGL canvas (#Stage), font definitions & touch handling
    ├── types.ts                      # TypeScript definitions (WorkProject, WorkExperienceProps)
    ├── data/
    │   └── defaultProjects.ts        # Default portfolio dataset
    └── utils/
        └── workBridge.ts             # Runtime bridge, route injector & lifecycle manager
```

#### 2. Static Assets (`public/`)
```
public/
├── unsupported.html                  # WebGL 2.0 unsupported device fallback
└── assets/
    ├── js/
    │   ├── app.1746999829739.js      # Core 3D engine, Work shaders, physics & render passes
    │   └── hydra/
    │       └── hydra-thread.js       # Background WebGL thread worker
    │
    ├── data/
    │   ├── uil.1746999829739.json    # Camera, layout, and shader configs
    │   ├── uil.json                  # Fallback layout definitions
    │   └── timeline-main.json        # Animation timelines
    │
    ├── fonts/
    │   ├── NBArchitektStd-Bold-export/
    │   │   ├── NBArchitektStd-Bold.otf
    │   │   ├── NBArchitektStd-Bold.woff
    │   │   └── NBArchitektStd-Bold.woff2
    │   ├── NBArchitektStd-Light-export/
    │   │   ├── NBArchitektStd-Light.otf
    │   │   ├── NBArchitektStd-Light.woff
    │   │   └── NBArchitektStd-Light.woff2
    │   ├── NBArchitektStd-Regular-export/
    │   │   ├── NBArchitektStd-Regular.otf
    │   │   ├── NBArchitektStd-Regular.woff
    │   │   └── NBArchitektStd-Regular.woff2
    │   ├── NBArchitektStd-Bold.json
    │   ├── NBArchitektStd-Bold.png   # 3D WebGL bitmap font textures
    │   ├── NBArchitektStd-Light.json
    │   ├── NBArchitektStd-Light.png
    │   ├── NBArchitektStd-Regular.json
    │   └── NBArchitektStd-Regular.png
    │
    ├── geometry/
    │   ├── work/
    │   │   ├── chainlink.bin         # Card border 3D geometry
    │   │   ├── cube.bin              # Card mesh geometry
    │   │   └── splines_anim4-SPLINES.json
    │   ├── particles/
    │   │   ├── flower_spine-128.bin  # Dynamic particle flow spines
    │   │   ├── flower_spine-256.bin
    │   │   └── flower_spine-512.bin
    │   ├── spine/
    │   │   └── spine.bin
    │   └── logo/
    │       └── AT_logo.bin
    │
    ├── images/
    │   ├── work/
    │   │   └── env1.ktx2             # Environment reflection map
    │   ├── room/
    │   │   ├── matcap-test.jpg       # Matcap shader texture
    │   │   └── matcap-test.ktx2
    │   ├── particle/
    │   │   └── matcap3.ktx2          # Particle shader matcap
    │   ├── pbr/
    │   │   ├── alien_cracked_2_basecolor.ktx2
    │   │   ├── alien_cracked_2_normal.png
    │   │   ├── black.png
    │   │   ├── cliffs_MRO.ktx2
    │   │   ├── corsica_beach-diffuse-RGBM.png
    │   │   ├── corsica_beach-specular-RGBM.png
    │   │   ├── cracked_ice_basecolor.ktx2
    │   │   ├── damaged_road_basecolor.png
    │   │   ├── damaged_road_mro.png
    │   │   ├── damaged_road_normal.jpg
    │   │   ├── damaged_road_normal.png
    │   │   ├── desert_bedrock_normal.png
    │   │   ├── jungle_soil_normal.png
    │   │   ├── lut.png
    │   │   └── woodplanks_normal.ktx2
    │   └── ui/
    │       ├── arrow.png
    │       ├── at-labrds.jpg
    │       ├── close.svg             # Modal close button icon
    │       ├── globe.png
    │       ├── ig.png
    │       ├── in.png
    │       ├── star.png
    │       └── tw.png
    │
    └── video/
        ├── reel.mp4                  # Video texture loop for project cards
        └── reel-frame.jpg            # Video poster placeholder
```

---

## 3. Asset Classification

### 🟢 REQUIRED (Strictly Necessary for Work)
These files are critical. Without them, WebGL shaders, card textures, 3D text, or geometry will throw 404s or fail to render:
- `src/work/*` (All 6 files in `src/work/`)
- `public/assets/js/app.1746999829739.js`
- `public/assets/js/hydra/hydra-thread.js`
- `public/assets/data/uil.1746999829739.json`, `uil.json`, `timeline-main.json`
- `public/assets/fonts/NBArchitektStd-*` (All font files & bitmap `.png`/`.json` textures)
- `public/assets/geometry/work/*` (`chainlink.bin`, `cube.bin`, `splines_anim4-SPLINES.json`)
- `public/assets/geometry/particles/*` (`flower_spine-*.bin`)
- `public/assets/geometry/spine/spine.bin`
- `public/assets/images/work/env1.ktx2`
- `public/assets/images/room/matcap-test.jpg`, `matcap-test.ktx2`
- `public/assets/images/particle/matcap3.ktx2`
- `public/assets/images/pbr/*` (Surface normals & PBR textures)
- `public/assets/images/ui/close.svg`, `at-labrds.jpg`, `arrow.png`
- `public/assets/video/reel.mp4`, `reel-frame.jpg`

### 🟡 OPTIONAL (Non-Critical Features)
- `public/assets/music/*.mp3` (Ambient audio tracks; only needed if `soundEnabled={true}`)
- `public/unsupported.html` (Fallback page for unsupported WebGL hardware)
- `public/assets/js/lib/_draco/*` & `public/assets/js/lib/basis_transcoder.*` (Only if loading compressed custom Draco/Basis models)

### 🔴 NOT REQUIRED (Do NOT Copy)
These files belong to other sections (Home, Tree scene, About, old build artifacts) and are completely unused by Work:
- `public/assets/images/tree_room/*` (All 22 tree room bake maps)
- `public/assets/images/_scenelayout/*` (Debug layout files)
- `public/assets/images/_lightvolume/*` (Light volume tests)
- `public/assets/images/_lighting/*` (Area light tests)
- `public/assets/images/lab.gif`, `lab.jpg`
- `public/assets/images/unsupported-bg.jpg`
- `public/assets/meta/*` (Favicons and old site manifest)
- `public/assets/png/*`
- `public/assets/css/style-scss.css` (Old precompiled stylesheet)
- `public/assets/shaders/compiled.fs` (Unused placeholder)
- `public/assets/js/hydra/hydra.js`, `hydra-wasm.js` (Unused placeholders)

---

## 4. Usage in React

### Basic Mounting

Simply import `<WorkExperience />` and mount it:

```tsx
import React from 'react';
import { WorkExperience } from './work';

export default function WorksSection() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <WorkExperience baseRoute="/works" />
    </section>
  );
}
```

---

## 5. Router & Lifecycle Integration

### Coexisting with Host Routes (`/about`, `/works`, `/contact`)

The `WorkExperience` component handles mount/unmount cleanly:
- **When Mounted (`/works`)**:
  - Sets up runtime route prefix (`/works`).
  - Activates WebGL canvas `#Stage`.
- **When Navigating Away (`/about` or `/contact`)**:
  - Automatically hides `#Stage` (`display: none; pointer-events: none`).
  - Pauses any active video or audio playback.
  - Removes custom event listeners.
- **When Returning (`/works`)**:
  - Restores `#Stage` display and interaction without having to re-download assets.

Example with React Router:
```tsx
import { Routes, Route } from 'react-router-dom';
import { WorkExperience } from './work';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/works/*" element={<WorkExperience baseRoute="/works" />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
```

---

## 5. Custom Projects Data

You can supply your own list of projects dynamically using the `projects` prop:

```tsx
import React from 'react';
import { WorkExperience, WorkProject } from './work';

const customProjects: WorkProject[] = [
  {
    title: 'Spatial Architecture',
    perma: 'spatial-arch',
    subhead: 'Next-generation spatial computing environment.',
    body: 'A comprehensive study of volumetric user interfaces and physics-based interactions in WebGL.',
    clientName: 'Future Labs',
    date: '2025\nFUTURE LABS\nSPATIAL',
    color: '00f2fe',
    tags: 'spatial, webgl, 3d, vision',
    thumbnailURL: '/assets/images/room/matcap-test.jpg',
    videoURL: '/assets/video/reel.mp4',
    caseStudyURL: 'https://example.com/case-study',
  },
  {
    title: 'Neural Audio Engine',
    perma: 'neural-audio',
    subhead: 'Real-time sound synthesis powered by Web Audio API.',
    body: 'Interactive generative soundscapes responsive to cursor acceleration and device tilt.',
    clientName: 'Acoustic AI',
    date: '2024\nACOUSTIC AI\nAUDIO',
    color: 'ff007f',
    tags: 'audio, ai, synthesis, webgl',
    thumbnailURL: '/assets/images/room/matcap-test.jpg',
    videoURL: '/assets/video/reel.mp4',
  }
];

export default function Portfolio() {
  return (
    <WorkExperience
      baseRoute="/works"
      projects={customProjects}
      onProjectSelect={(project) => console.log('Opened project:', project.title)}
      onProjectClose={() => console.log('Closed project detail')}
    />
  );
}
```

---

## 6. Props & API Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `baseRoute` | `string` | `"/work"` | URL prefix where the Work experience is mounted (e.g., `"/works"`, `"/portfolio"`). |
| `projects` | `WorkProject[]` | `DEFAULT_WORK_PROJECTS` | Array of project objects rendered along the 3D helix. |
| `initialSlug` | `string` | `undefined` | Opens a project detail view directly on mount (e.g. `"museum-of-weed"`). |
| `onProjectSelect` | `(project: WorkProject) => void` | `undefined` | Callback fired when a user clicks or opens a project card. |
| `onProjectClose` | `() => void` | `undefined` | Callback fired when the 3D detail view closes (via ESC or back navigation). |
| `className` | `string` | `""` | Additional CSS classes for the container. |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the container. |
| `soundEnabled` | `boolean` | `true` | Enables/disables ambient audio playback. |

---

## 7. Helper Functions (`workBridge`)

The module exports helper utilities in `src/work`:

```ts
import {
  openProjectSlug,
  closeProjectDetail,
  DEFAULT_WORK_PROJECTS
} from './work';

// Programmatically navigate to a project
openProjectSlug('museum-of-weed');

// Programmatically close the active project
closeProjectDetail();
```

---

## 8. Global Event Bridge

The 3D engine dispatches a standard `CustomEvent` on `window`:

```ts
window.addEventListener('work:project-change', (e: Event) => {
  const customEvent = e as CustomEvent<{ project: WorkProject | null; previous: WorkProject | null }>;
  if (customEvent.detail.project) {
    console.log('Active project:', customEvent.detail.project);
  } else {
    console.log('Returned to helix overview');
  }
});
```

---

## 9. Preserved Systems

No simplifications or rewrites were made:
- Full WebGL Frag3D / Nuke pipeline
- Multi-pass Bloom, DownSample, UpSample, and Lens Flare
- Particle flow spine and dynamic shader uniforms
- Real-time glass refraction and Fresnel reflection passes
- Touch and inertial momentum scroll physics
- Direct slug deep-linking and browser history synchronization
