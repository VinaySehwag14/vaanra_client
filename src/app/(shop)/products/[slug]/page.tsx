import ProductDetailClient from "@/components/product-detail/product-detail-client";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;

    return <ProductDetailClient slug={slug} />;
}
