"use client";

import Header from "../../../components/header/Header";
import { CompanyProvider } from "../../../context/CompanyContext";
import { useSession } from "next-auth/react";
import { Spinner } from "../../../components/utilities/Spinner";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();

  if (status === "loading" || status === "unauthenticated") {
    return <Spinner></Spinner>;
  }

  return (
    <CompanyProvider>
      <div>
        <Header></Header>
        {children}
      </div>
    </CompanyProvider>
  );
}
