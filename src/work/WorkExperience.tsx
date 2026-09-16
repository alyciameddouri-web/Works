import { useEffect, useRef, memo } from 'react';
import type { WorkExperienceProps } from './types';
import { DEFAULT_WORK_PROJECTS } from './data/defaultProjects';
import {
  DEFAULT_WORK_CONFIG,
  setupWorkRuntime,
  ensurePreload,
  ensureScript,
  openProjectSlug,
  closeProjectDetail,
} from './utils/workBridge';
import './work.css';

export const WorkExperience = memo(function WorkExperience({
  baseRoute = '/work',
  projects = DEFAULT_WORK_PROJECTS,
  initialSlug,
  onProjectSelect,
  onProjectClose,
  className = '',
  style,
}: WorkExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectCallbackRef = useRef(onProjectSelect);
  const closeCallbackRef = useRef(onProjectClose);

  selectCallbackRef.current = onProjectSelect;
  closeCallbackRef.current = onProjectClose;

  useEffect(() => {
    // 1. Mark body/html for Work active state
    document.documentElement.classList.add('work-active');
    document.body.classList.add('work-active');

    // 2. Configure runtime environment and project data
    setupWorkRuntime(baseRoute, projects, DEFAULT_WORK_CONFIG);

    // 3. Ensure Stage canvas is visible if remounting
    const stageEl = document.getElementById('Stage');
    if (stageEl) {
      stageEl.style.display = 'block';
      stageEl.style.pointerEvents = 'auto';
    }

    // 4. Preload and inject the core 3D Work experience bundle
    ensurePreload(DEFAULT_WORK_CONFIG.preloadLinkId, DEFAULT_WORK_CONFIG.appScriptPath);
    ensureScript(DEFAULT_WORK_CONFIG.appScriptId, DEFAULT_WORK_CONFIG.appScriptPath).then(() => {
      if (initialSlug) {
        // Allow WebGL stage to initialize before requesting direct slug
        setTimeout(() => {
          openProjectSlug(initialSlug);
        }, 300);
      }
    });

    // 5. Listen to project selection / close custom events dispatched by the 3D scene
    const handleProjectEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        project: unknown;
        previous: unknown;
      }>;
      const project = customEvent.detail?.project;
      if (project) {
        selectCallbackRef.current?.(project as never);
      } else {
        closeCallbackRef.current?.();
      }
    };

    window.addEventListener('work:project-change', handleProjectEvent);

    return () => {
      window.removeEventListener('work:project-change', handleProjectEvent);
      document.documentElement.classList.remove('work-active');
      document.body.classList.remove('work-active');

      // Hide WebGL Stage so it doesn't overlay or intercept clicks in other routes (About, Contact, etc.)
      const stage = document.getElementById('Stage');
      if (stage) {
        stage.style.display = 'none';
        stage.style.pointerEvents = 'none';
      }

      // Close open project detail overlay state if active
      closeProjectDetail();
    };
  }, [baseRoute, projects, initialSlug]);

  return (
    <div
      ref={containerRef}
      id="work-experience-root"
      className={`work-experience-container relative w-full h-full min-h-screen overflow-hidden ${className}`}
      style={style}
    />
  );
});

export default WorkExperience;

