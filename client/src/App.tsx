"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/login/Login";
import SongsApp from "./components/songs/SongsApp";
import Spinner from "./components/ui/Spinner";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const queryClient = new QueryClient();

function Root() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <Spinner />
      </div>
    );
  }

  return token ? <SongsApp /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Root />
        <Footer />
      </QueryClientProvider>
    </AuthProvider>
  );
}
