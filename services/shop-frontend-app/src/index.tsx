import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import { AxiosError } from "axios";

const BE_NOT_YET_IMPLEMENTED = true;

function handleError(err: unknown) {
  if (err instanceof AxiosError) {
    debugger;
    if (err.response?.status === 401) {
      alert("You are not authorized to perform this action");
    } else if (err.response?.status === 403) {
      alert("You are not allowed to perform this action");
    } else if (err.response?.status === 404) {
      alert("The requested resource was not found");
    } else if (err.response?.status === 500) {
      alert("An internal server error occurred");
    } else if (err.response?.status === 501) {
      alert("An internal server error occurred");
    } else {
      alert("An error occurred");
    }
  }
  console.error(err);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      onError: handleError,
    },
    mutations: {
      onError: handleError,
    },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
} else if (BE_NOT_YET_IMPLEMENTED) {
  hydrate(queryClient, await import("./queries/dehydrated.json"));
}

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
