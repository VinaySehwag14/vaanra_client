import CategoryHero from "@/components/products/category-hero";
import ProductFilters from "@/components/products/product-filters";
import ProductsContainer from "@/components/products/products-container";

const categoryInfo: Record<string, { title: string; description: string; image: string }> = {
    "t-shirts": {
        title: "T-Shirts",
        description: "Discover our premium collection of cotton t-shirts. Breathable, durable, and designed for everyday comfort.",
        image: "/carousel/summer-edit.jpg",
    },
    hoodies: {
        title: "Hoodies",
        description: "Our latest collection of hoodies combines premium comfort with street-ready design. Perfect for any adventure.",
        image: "/gallery/vaanra-2.jpg",
    },
    sweatshirts: {
        title: "Sweatshirts",
        description: "Cozy up in our softest sweatshirts. The perfect layer for those chilly evenings and relaxed weekends.",
        image: "/carousel/winter-collection.jpg",
    },
    jackets: {
        title: "Jackets",
        description: "Brave the elements with our stylish jackets. From lightweight windbreakers to warm winter coats.",
        image: "/looks/vaanra-explorer.jpg",
    },
    bottoms: {
        title: "Bottoms",
        description: "Complete your look with our versatile bottoms. Joggers, cargos, and shorts for every occasion.",
        image: "/gallery/vaanra-1.jpg",
    },
    all: {
        title: "All Products",
        description: "Explore our full range of urban streetwear. Designed for those who move with the city.",
        image: "/carousel/summer-edit.jpg",
    },
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const category = (params.category as string) || "all";
    const info = categoryInfo[category] || categoryInfo["all"];

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950 relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none opacity-20" />

            <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 relative z-10">
                {/* Breadcrumbs */}
                <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>Home</span>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                        {info.title}
                    </span>
                </div>

                {/* Hero Section */}
                <CategoryHero
                    title={info.title}
                    description={info.description}
                    image={info.image}
                />

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 lg:shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Product Grid - Now fetches from API */}
                    <ProductsContainer />
                </div>
            </div>
        </div>
    );
}
