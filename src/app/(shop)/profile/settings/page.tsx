"use client";

import { useAuth } from "@/hooks/useAuth";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import PersonalInfoSection from "@/components/settings/personal-info-section";
import SecuritySection from "@/components/settings/security-section";

export default function SettingsPage() {
    const { user, loading } = useAuth();
    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <ProfileSidebar />

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Account Settings
                            </h1>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                                Manage your account details and preferences.
                            </p>
                        </div>

                        {/* Personal Information Section */}
                        <PersonalInfoSection user={user} loading={loading} />

                        {/* Security Section */}
                        <SecuritySection />
                    </div>
                </div>
            </div>
        </div>
    );
}
