import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

export const useProctoring = (onViolation, isActive = true) => {
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationCountRef = useRef(0);
  const maxViolations = 3;
  const lastViolationTime = useRef(0);

  const addViolation = useCallback((type, description) => {
    if (!isActive) return;

    const now = Date.now();
    if (now - lastViolationTime.current < 1000) return;
    lastViolationTime.current = now;

    const violation = {
      type,
      description,
      timestamp: new Date().toISOString(),
    };

    setViolations((prev) => {
      const newViolations = [...prev, violation];
      violationCountRef.current = newViolations.length;

      console.log('Violation added:', violation); 
      console.log('Total violations:', violationCountRef.current); 

      toast.error(`⚠️ Violation #${violationCountRef.current}: ${description}`);

      if (violationCountRef.current >= maxViolations) {
        console.log('MAX VIOLATIONS REACHED - Auto-submitting');
        toast.error('Maximum violations reached! Auto-submitting exam...');
        
        setTimeout(() => {
          if (onViolation) {
            onViolation(newViolations);
          }
        }, 1000);
      } else {
        toast.warning(
          `Warning: ${violationCountRef.current}/${maxViolations} violations. ${
            maxViolations - violationCountRef.current
          } more will auto-submit the exam.`
        );
      }

      return newViolations;
    });
  }, [isActive, maxViolations, onViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('tab_switch', 'Switched to another tab or window');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleBlur = () => {
      addViolation('window_blur', 'Window lost focus (minimized or switched)');
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleFocus = () => {
      if (document.hidden) {
        addViolation('tab_return', 'Returned to tab after switching away');
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || 
          e.clientY >= window.innerHeight) {
        addViolation('mouse_exit', 'Mouse left the browser window');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      const isNowFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      setIsFullscreen(isNowFullscreen);

      if (!isNowFullscreen && document.fullscreenEnabled) {
        addViolation('fullscreen_exit', 'Exited fullscreen mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive, addViolation]);

  useEffect(() => {
    if (!isActive) return;

    const preventCopy = (e) => {
      e.preventDefault();
      toast.warning('Copying is disabled during the exam');
    };

    const preventPaste = (e) => {
      e.preventDefault();
      toast.warning('Pasting is disabled during the exam');
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventPaste);
    document.addEventListener('cut', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventPaste);
      document.removeEventListener('cut', preventCopy);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const preventContextMenu = (e) => {
      e.preventDefault();
      toast.warning('Right-click is disabled during the exam');
    };

    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const preventDevTools = (e) => {
  
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85) ||
        (e.ctrlKey && e.keyCode === 83)
      ) {
        e.preventDefault();
        toast.warning('This keyboard shortcut is disabled during the exam');
      }
    };

    document.addEventListener('keydown', preventDevTools);
    return () => document.removeEventListener('keydown', preventDevTools);
  }, [isActive]);

  const requestFullscreen = useCallback(() => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  return {
    violations,
    violationCount: violationCountRef.current,
    maxViolations,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
  };
};
