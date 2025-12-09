"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ApiClient } from "@/lib/api-client";
import { Banner } from "@/types/banner";

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
}

export default function HeroCarousel() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Fetch banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setError(null);

                const response = await ApiClient.getBanners();

                // Filter only active banners and map to Slide format
                const activeBanners: Slide[] = response.banners
                    .filter((banner: Banner) => banner.is_active)
                    .map((banner: Banner, index: number) => ({
                        id: index + 1,
                        title: banner.title,
                        subtitle: banner.sub_text,
                        buttonText: "Shop Now",
                        buttonLink: banner.link,
                        image: banner.image,
                        imageAlt: banner.title,
                    }));

                setSlides(activeBanners);
            } catch (err) {
                console.error("Failed to fetch banners:", err);
                setError("Failed to load banners");
            }
        };

        fetchBanners();
    }, []);


    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    useEffect(() => {
        if (!isAutoPlaying || slides.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Auto-advance every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, slides.length]);

    const handlePrevClick = () => {
        setIsAutoPlaying(false);
        prevSlide();
    };

    const handleNextClick = () => {
        setIsAutoPlaying(false);
        nextSlide();
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            {/* Error State */}
            {error && (
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
                    <div className="text-center space-y-4 px-4">
                        <p className="text-white/80 text-lg">{error}</p>
                        <p className="text-white/60 text-sm">Please try again later</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!error && slides.length === 0 && (
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
                    <div className="text-center space-y-4 px-4">
                        <p className="text-white/80 text-lg">No banners available</p>
                    </div>
                </div>
            )}

            {/* Slides Container */}
            {!error && slides.length > 0 && (
                <>
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={slide.image}
                                        alt={slide.imageAlt}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                    {/* Dark Overlay for better text readability */}
                                    <div className="absolute inset-0 bg-black/30" />
                                </div>

                                {/* Content */}
                                <div className="relative flex h-full items-center justify-center px-4 text-center">
                                    <div className="max-w-3xl space-y-6">
                                        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                                            {slide.title}
                                        </h2>
                                        <p className="mx-auto max-w-2xl text-base text-white/90 md:text-lg lg:text-xl">
                                            {slide.subtitle}
                                        </p>
                                        <div className="pt-4">
                                            <a
                                                href={slide.buttonLink}
                                                className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50"
                                            >
                                                {slide.buttonText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrevClick}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 md:left-6 md:p-3"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                        onClick={handleNextClick}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 md:right-6 md:p-3"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/75"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
