import { useEffect } from "react";

/**
 * 컴포넌트 마운트 시 페이지 최상단으로 스크롤을 이동시키는 훅
 */
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
}
