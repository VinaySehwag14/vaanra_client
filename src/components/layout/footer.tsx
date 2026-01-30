import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
    {
        title: "Shop",
        links: [
            { label: "New Arrivals", href: "/products?sort=new" },
            { label: "Best Sellers", href: "/products?sort=best-selling" },
            { label: "T-Shirts", href: "/products?category=t-shirts" },
            { label: "Hoodies", href: "/products?category=hoodies" },
            { label: "Accessories", href: "/products?category=accessories" },
            { label: "Sale", href: "/products?category=sale" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Order Status", href: "/orders" },
            { label: "Returns", href: "/returns" },
            { label: "Size Guide", href: "/size-guide" },
            { label: "Contact Us", href: "/contact" },
            { label: "Shipping", href: "/shipping" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Vaanra", href: "/about" },
            { label: "Sustainability", href: "/sustainability" },
            { label: "Careers", href: "/careers" },
            { label: "Terms", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
            { label: "Press", href: "/press" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="w-full bg-black relative overflow-hidden pt-16 pb-8 border-t border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            {/* Massive Watermark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none opacity-[0.02]">
                <h1 className="text-[10rem] font-black tracking-tighter text-white leading-none whitespace-nowrap">
                    VAANRA
                </h1>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">

                    {/* Left Column: Brand, Desc, Newsletter, Socials */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
                                <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src="/logo/vaanra_iconic_rm_bg.png"
                                        alt="Vaanra Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span
                                    className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#DD6031] via-[#E07A4C] to-[#DD6031] transition-all duration-300 group-hover:tracking-wide"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    VAANRA
                                </span>
                            </Link>
                            <p className="text-zinc-400 text-sm leading-relaxed font-medium max-w-sm">
                                Engineered for the modern urban aesthete. Sustainable, premium, and designed to stand out.
                            </p>
                        </div>

                        {/* Integrated Newsletter */}
                        <div className="w-full max-w-sm">
                            <form className="flex w-full items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="email"
                                        placeholder="Subscribe to newsletter"
                                        className="h-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 rounded-lg focus:border-primary/50 focus:ring-primary/20 transition-all text-sm"
                                    />
                                </div>
                                <Button size="icon" className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>

                        <div className="flex gap-3">
                            <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
                            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
                            <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} label="Facebook" />
                            <SocialLink href="#" icon={<Youtube className="w-4 h-4" />} label="YouTube" />
                        </div>
                    </div>

                    {/* Right Column: Links Grid */}
                    <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 text-right lg:text-left">
                        {footerLinks.map((section) => (
                            <div key={section.title} className="flex flex-col gap-6">
                                <h4 className="font-bold text-white text-base tracking-wide">{section.title}</h4>
                                <ul className="flex flex-col gap-3">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium hover:translate-x-1 inline-block duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-xs text-zinc-500 font-medium tracking-wide">
                    <p>© {new Date().getFullYear()} Vaanra. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
            aria-label={label}
        >
            <div className="group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
        </Link>
    );
}
