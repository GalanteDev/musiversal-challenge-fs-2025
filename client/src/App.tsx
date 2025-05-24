"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/login/Login";
import SongsApp from "./components/songs/SongsApp";
import Spinner from "./components/ui/Spinner";

const queryClient = new QueryClient();

function Root() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return token ? <SongsApp /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </AuthProvider>
  );
}
