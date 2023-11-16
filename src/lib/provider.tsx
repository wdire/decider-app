"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ImdbProvider } from "@/context/imdb.context";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ImdbProvider>{children}</ImdbProvider>
    </QueryClientProvider>
  );
}

export default Providers;
