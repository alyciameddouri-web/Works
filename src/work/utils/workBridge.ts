import type { WorkConfig, WorkProject } from '../types';
import { DEFAULT_WORK_PROJECTS } from '../data/defaultProjects';

export const DEFAULT_WORK_CONFIG: WorkConfig = {
  cacheKey: '1746999829739',
  appScriptPath: '/assets/js/app.1746999829739.js',
  appScriptId: 'active-theory-work-script',
  preloadLinkId: 'active-theory-work-preload',
  uilStaticPath: '/assets/data/uil.1746999829739.json',
  unsupportedPage: '/unsupported.html',
};

declare global {
  interface Window {
    _ENV_?: 'production';
    _CMS_?: string;
    _CACHE_?: string;
    _UNSUPPORTED_PAGE_?: string;
    UIL_STATIC_PATH?: string;
    WORK_BASE_ROUTE?: string;
    WORK_PROJECTS?: WorkProject[];
    CMS_DATA?: {
      projects?: unknown[];
      metadata?: unknown;
      contact?: unknown;
      [key: string]: unknown;
    };
    AppState?: {
      set: (key: string, value: unknown, force?: boolean) => void;
      get: (key: string) => unknown;
      bind: (key: string, callback: (value: unknown) => void) => void;
      fire: (key: string, ...args: unknown[]) => void;
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Normalizes a base route string to remove trailing slashes.
 * e.g. '/works/' -> '/works'
 */
export function normalizeRoute(route?: string): string {
  if (!route) return '/work';
  const trimmed = route.trim();
  if (trimmed === '/' || trimmed === '') return '';
  return trimmed.startsWith('/') ? trimmed.replace(/\/+$/, '') : `/${trimmed.replace(/\/+$/, '')}`;
}

/**
 * Configures global runtime parameters for the Work 3D experience.
 */
export function setupWorkRuntime(
  baseRoute: string = '/work',
  projects: WorkProject[] = DEFAULT_WORK_PROJECTS,
  config: WorkConfig = DEFAULT_WORK_CONFIG
): void {
  const cleanBase = normalizeRoute(baseRoute);
  const routeSegment = cleanBase.replace(/^\//, '');

  window.WORK_BASE_ROUTE = routeSegment || 'work';
  window.WORK_PROJECTS = projects;

  // Pre-seed window.CMS_DATA.projects so CMSData doesn't rely on external endpoints
  window.CMS_DATA = window.CMS_DATA || {};
  window.CMS_DATA.projects = projects;

  // Hydrate runtime environment variables
  window._ENV_ = 'production';
  window._CMS_ = '%CMS%';
  window._CACHE_ = config.cacheKey;
  window._UNSUPPORTED_PAGE_ = config.unsupportedPage;
  window.UIL_STATIC_PATH = config.uilStaticPath;

  // Handle current URL path alignment if needed
  const currentPath = window.location.pathname;
  if (cleanBase && !currentPath.startsWith(cleanBase) && !currentPath.startsWith('/work')) {
    window.history.replaceState(null, '', cleanBase || '/');
  }
}

/**
 * Appends a preload link to document head if not already present.
 */
export function ensurePreload(id: string, href: string): void {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.href = href;
  link.rel = 'preload';
  link.as = 'script';
  document.head.appendChild(link);
}

/**
 * Injects a script tag into document head if not already present.
 */
export function ensureScript(id: string, src: string, async = true): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = async;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

/**
 * Programmatically opens a project detail view by slug.
 */
export function openProjectSlug(slug: string): void {
  const base = window.WORK_BASE_ROUTE || 'work';
  const targetRoute = `${base}/${slug}`;
  if (window.AppState) {
    window.AppState.set('ViewController/navigate', targetRoute);
  } else {
    window.history.pushState(null, '', `/${targetRoute}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

/**
 * Programmatically closes the current 3D project detail view.
 */
export function closeProjectDetail(): void {
  if (window.AppState) {
    window.AppState.set('Work/project', null);
  }
}

/**
 * Hides the WebGL #Stage canvas and pauses any background media when navigating away from Work.
 */
export function hideWorkStage(): void {
  const stage = document.getElementById('Stage');
  if (stage) {
    stage.style.display = 'none';
    stage.style.pointerEvents = 'none';
  }
  pauseWorkMedia();
}

/**
 * Shows and restores interaction to the WebGL #Stage canvas when returning to Work.
 */
export function showWorkStage(): void {
  const stage = document.getElementById('Stage');
  if (stage) {
    stage.style.display = 'block';
    stage.style.pointerEvents = 'auto';
  }
}

/**
 * Pauses active HTML video and audio elements on unmount.
 */
export function pauseWorkMedia(): void {
  const mediaElements = document.querySelectorAll<HTMLMediaElement>('video, audio');
  mediaElements.forEach((el) => {
    try {
      if (!el.paused) {
        el.pause();
      }
    } catch {
      // Ignore media pause exceptions
    }
  });
}
