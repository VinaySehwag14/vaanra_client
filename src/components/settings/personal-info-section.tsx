"use client";

import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PersonalInfoSectionProps {
    user: FirebaseUser | null;
    loading: boolean;
}

export default function PersonalInfoSection({
    user,
    loading,
}: PersonalInfoSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            const displayName = user.displayName || "";
            const nameParts = displayName.split(" ");
            setFormData({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
            });
        }
    }, [user]);

    const handleSave = () => {
        // In a real app, this would save to backend
        console.log("Saving personal info:", formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset to current user data
        if (user) {
            const displayName = user.displayName || "";
            const nameParts = displayName.split(" ");
            setFormData({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
            });
        }
        setIsEditing(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-6 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="h-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                        <div className="h-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                    </div>
                    <div className="h-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Personal Information
                </h2>
            </div>

            {/* Form */}
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                            disabled={!isEditing}
                            className={!isEditing ? "bg-zinc-50 dark:bg-zinc-800" : ""}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                            disabled={!isEditing}
                            className={!isEditing ? "bg-zinc-50 dark:bg-zinc-800" : ""}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-zinc-50 dark:bg-zinc-800" : ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-zinc-50 dark:bg-zinc-800" : ""}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="rounded-full bg-primary text-black hover:bg-primary"
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="rounded-full"
                        >
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
