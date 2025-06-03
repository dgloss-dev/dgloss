import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export const useModalScrollLock = (isOpen: boolean) => {
  const pathname = usePathname();
  const [modalCount, setModalCount] = useState(0);

  const lockScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    setModalCount((prev) => (isOpen ? prev + 1 : Math.max(0, prev - 1)));
  }, [isOpen]);

  useEffect(() => {
    if (modalCount > 0) {
      const unlockScroll = lockScroll();
      return () => {
        if (unlockScroll) {
          unlockScroll();
        }
      };
    }
  }, [pathname, modalCount, lockScroll]);

  return modalCount;
};
