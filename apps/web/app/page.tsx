"use client";
import { useUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: user } = useUser();
  const router = useRouter();
  console.log("User info from server:", user);
  useEffect(() => {
    if (user && user.id) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server Response: {user?.fullName}</h2>
      </div>
    </main>
  );
}
