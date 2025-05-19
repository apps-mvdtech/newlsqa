"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [status, router]);
}
