// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30, // 30분 (미사용 캐시 정리)
      retry: 1, // 실패 시 1회 재시도
      // refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 방지
    },
  },
});
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ReactQueryDevtools />
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
  // </StrictMode>
);
