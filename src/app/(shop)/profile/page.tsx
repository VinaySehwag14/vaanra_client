"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import ProfileSidebar from "@/components/profile/profile-sidebar";
import PersonalInfo from "@/components/profile/personal-info";
import RecentOrder from "@/components/profile/recent-order";
import SavedItems from "@/components/profile/saved-items";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const greetingName = useMemo(() => {
    if (!user) return "there";
    if (user.displayName) {
      return user.displayName.split(" ")[0]; // first name from displayName
    }
    if (user.email) {
      return user.email.split("@")[0]; // username part of email
    }
    return "there";
  }, [user]);

  // While checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        </div>
      </div>
    );
  }

  // If not logged in, we're redirecting
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Redirecting to login...
        </p>
      </div>
    );
  }

  // Authenticated UI
  return (
    <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <ProfileSidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                Hello, {greetingName}!
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Welcome to your dashboard. Here&apos;s an overview of your account.
              </p>
            </div>

            {/* Personal Information & Recent Order */}
            <div className="grid gap-6 lg:grid-cols-2">
              <PersonalInfo />
              <RecentOrder />
            </div>

            {/* Saved Items */}
            <SavedItems />
          </div>
        </div>
      </div>
    </div>
  );
}
