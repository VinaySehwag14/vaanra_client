import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] overflow-hidden">
                <Image
                    src="/carousel/summer-edit.jpg"
                    alt="The Story of the Wave"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        The Story of the Wave
                    </h1>
                    <p className="max-w-2xl text-lg text-white/90 md:text-xl">
                        From small beginnings to making waves in streetwear, discover our journey and what drives us forward.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
                {/* Our Mission Section */}
                <section className="mb-20">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <Image
                                src="/looks/vaanra-explorer.jpg"
                                alt="Our Mission"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                                Our Mission
                            </h2>
                            <p className="mb-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                At Vaanra, our mission is simple: to create comfortable, stylish, and sustainable streetwear that empowers you to express yourself.
                            </p>
                            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                We believe fashion should be accessible, ethical, and fun. That's why we use eco-friendly materials and ethical manufacturing practices to bring you clothing that looks good and feels even better.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                <section className="mb-20">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                            Our Values
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                            These principles guide everything we do
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Value 1 */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-primary/20">
                                <Sparkles className="h-6 w-6 text-primary dark:text-primary" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Quality Craftsmanship
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                We believe in creating products that last. Every piece is carefully crafted with attention to detail and premium materials.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Community First
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Our community is at the heart of everything we do. We listen, engage, and grow together with our customers.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/30">
                                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Sustainability First
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                We're committed to reducing our environmental impact through sustainable materials and ethical practices.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Behind the Waves Section */}
                <section className="mb-20">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                            Behind the Waves
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                            A glimpse into our creative process, our team, and the people who make it all possible
                        </p>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src="/gallery/vaanra-1.jpg"
                                alt="Behind the scenes"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl md:col-span-1 md:row-span-2">
                            <Image
                                src="/carousel/winter-collection.jpg"
                                alt="Our products"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src="/looks/coastal-vibe.jpg"
                                alt="Team collaboration"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src="/looks/vaanra-explorer.jpg"
                                alt="Design process"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl md:col-span-2 md:row-span-1">
                            <Image
                                src="/gallery/vaanra-2.jpg"
                                alt="Our community"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src="/carousel/summer-edit.jpg"
                                alt="Product details"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    </div>
                </section>

                {/* Join the Community CTA */}
                <section className="rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-12 text-center md:p-16">
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                        Join the Community
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                        Ready to make waves with us? Join our community of style enthusiasts and get exclusive access to new drops, special offers, and more.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-white text-primary hover:bg-zinc-100"
                    >
                        <Link href="/products">Shop Now</Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}
