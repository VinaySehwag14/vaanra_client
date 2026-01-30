"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <Dialog>
                <DialogTrigger asChild>
                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in group border border-gray-100">
                        <Image
                            src={images[selectedImage]}
                            alt="Product Image"
                            fill
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Edition Badge */}
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold text-gray-700 uppercase tracking-wide shadow-sm">
                            Studio Edition
                        </div>

                        {/* Zoom Hint */}
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <Expand className="w-4 h-4 text-gray-600" />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white border-none rounded-xl overflow-hidden">
                    <div className="relative w-full h-[85vh]">
                        <Image
                            src={images[selectedImage]}
                            alt="Product Image - Fullscreen"
                            fill
                            className="object-contain"
                            sizes="95vw"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Thumbnail Row */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200",
                                selectedImage === index
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
