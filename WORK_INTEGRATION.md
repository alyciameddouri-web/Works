# Work Experience — Integration Manual

This manual explains how to integrate the **Active Theory 3D Work Experience** into any modern React application (Vite, Next.js, CRA, etc.).

---

## 1. Quick Integration

### Step 1: Copy Files to Your Project

1. Copy the `src/work` directory to your project's `src/` directory.
2. Copy the required static assets from `public/assets/` into your project's `public/assets/` directory.

### Step 2: Render `<WorkExperience />`

In your Works page or route component (e.g. `/works`):

```tsx
import React from 'react';
import { WorkExperience } from './work';

export default function WorksPage() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <WorkExperience baseRoute="/works" />
    </main>
  );
}
```

*Note: CSS (`work.css`) is imported automatically by `WorkExperience.tsx` — no manual CSS import is required.*

---

## 2. Custom Projects Data

Pass custom project items through the `projects` prop:

```tsx
import React from 'react';
import { WorkExperience, WorkProject } from './work';

const myProjects: WorkProject[] = [
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

export default function WorksPage() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <WorkExperience
        baseRoute="/works"
        projects={myProjects}
        onProjectSelect={(project) => console.log('Opened:', project.title)}
        onProjectClose={() => console.log('Closed project detail')}
      />
    </main>
  );
}
```

---

## 3. Package Structure

```
NEW PROJECT/
├── src/
│   └── work/
│       ├── index.ts                  # Public exports
│       ├── WorkExperience.tsx        # React component with auto-cleanup
│       ├── work.css                  # Self-contained WebGL stage & font CSS
│       ├── types.ts                  # TypeScript interfaces (WorkProject, etc.)
│       ├── data/
│       │   └── defaultProjects.ts    # Bundled portfolio dataset
│       └── utils/
│           └── workBridge.ts         # Runtime bridge & route injector
│
└── public/
    ├── unsupported.html              # WebGL 2.0 unsupported device fallback
    └── assets/
        ├── js/
        │   ├── app.1746999829739.js  # Core 3D engine, Work shaders, physics & render passes
        │   └── hydra/
        │       └── hydra-thread.js   # Background WebGL thread worker
        │
        ├── data/
        │   ├── uil.1746999829739.json# Camera, layout, and shader configs
        │   ├── uil.json              # Fallback layout definitions
        │   └── timeline-main.json    # Animation timelines
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
        │   ├── NBArchitektStd-Bold.png
        │   ├── NBArchitektStd-Light.json
        │   ├── NBArchitektStd-Light.png
        │   ├── NBArchitektStd-Regular.json
        │   └── NBArchitektStd-Regular.png
        │
        ├── geometry/
        │   ├── work/
        │   │   ├── chainlink.bin     # Card border 3D geometry
        │   │   ├── cube.bin          # Card mesh geometry
        │   │   └── splines_anim4-SPLINES.json
        │   ├── particles/
        │   │   ├── flower_spine-128.bin # Dynamic particle flow spines
        │   │   ├── flower_spine-256.bin
        │   │   └── flower_spine-512.bin
        │   ├── spine/
        │   │   └── spine.bin
        │   └── logo/
        │       └── AT_logo.bin
        │
        ├── images/
        │   ├── work/
        │   │   └── env1.ktx2         # Environment reflection map
        │   ├── room/
        │   │   ├── matcap-test.jpg   # Matcap shader texture
        │   │   └── matcap-test.ktx2
        │   ├── particle/
        │   │   └── matcap3.ktx2      # Particle shader matcap
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
        │       ├── close.svg         # Modal close button icon
        │       ├── globe.png
        │       ├── ig.png
        │       ├── in.png
        │       ├── star.png
        │       └── tw.png
        │
        └── video/
            ├── reel.mp4              # Video texture loop for project cards
            └── reel-frame.jpg        # Video poster placeholder
```

---

## 4. Required Dependencies

No extra npm packages are required beyond React standard packages:
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

---

## 5. Props & Public API

```ts
import type { CSSProperties } from 'react';

export interface WorkProject {
  title: string;
  perma: string;             // Unique URL slug (e.g. "museum-of-weed")
  subhead?: string;
  body?: string;
  clientName?: string;
  date?: string;             // Multiline display string (e.g. "2024\nCLIENT\nTYPE")
  color?: string;            // Hex color code without '#' (e.g. "00f2fe")
  tags?: string;             // Comma-separated tags
  thumbnailURL?: string;     // Preview thumbnail
  videoURL?: string;         // Video loop URL for 3D card
  caseStudyURL?: string;     // External link or case study URL
  priority?: number;
  index?: number;
}

export interface WorkExperienceProps {
  /** Route prefix where the component is mounted (default: "/work") */
  baseRoute?: string;
  /** Array of projects displayed in the 3D spiral */
  projects?: WorkProject[];
  /** Open a specific project detail view immediately on mount */
  initialSlug?: string;
  /** Callback fired when a project is selected/opened */
  onProjectSelect?: (project: WorkProject) => void;
  /** Callback fired when project detail view is closed */
  onProjectClose?: () => void;
  /** Custom container CSS class names */
  className?: string;
  /** Inline container styles */
  style?: CSSProperties;
  /** Enables/disables ambient soundtrack audio (default: true) */
  soundEnabled?: boolean;
}
```

---

## 6. Router Integration (`/works` & `/works/:slug`)

- When mounting `<WorkExperience baseRoute="/works" />`, clicking on any 3D project card updates the URL to `/works/[slug]` via HTML5 History pushState.
- If deep-linked directly to `/works/museum-of-weed` or when `initialSlug="museum-of-weed"` is provided, the 3D camera smoothly opens that project's detail view directly.
- In multi-page apps (e.g. `/about`, `/works`, `/contact`), configure your router to direct both `/works` and `/works/*` to the component rendering `<WorkExperience baseRoute="/works" />`.

---

## 7. Lifecycle & Unmount Handling

When the user navigates away from `/works` (e.g., to `/about` or `/contact`):
1. `WorkExperience` automatically hides the WebGL `#Stage` container (`display: none`, `pointer-events: none`).
2. Clears body scroll locks and active classes so standard HTML pages scroll normally.
3. Removes global window event listeners.
4. When the user returns to `/works`, `WorkExperience` restores `#Stage` visibility and resumes interaction seamlessly.

---

## 8. Helper Functions

```ts
import {
  openProjectSlug,
  closeProjectDetail,
  DEFAULT_WORK_PROJECTS
} from './work';

// Programmatically navigate to any project in the 3D scene
openProjectSlug('museum-of-weed');

// Programmatically close the detail view
closeProjectDetail();
```

---

## 9. Global Side Effects Summary

1. **DOM Canvas**: The engine dynamically appends `<div id="Stage"><canvas></div>` to the DOM. `WorkExperience` manages its visibility and interaction lifecycle on mount/unmount.
2. **Static Asset Base**: Assets must be served under `/assets/...` from your host app's public root.
3. **Touch Physics**: On mobile, `touch-action: none` is applied while Work is active to facilitate smooth inertial momentum navigation.
