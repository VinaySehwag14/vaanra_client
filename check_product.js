require('dotenv').config({ path: '/Users/vinay_sehwag/Desktop/vaanra/.env' });
const { createClient } = require('@supabase/supabase-js');

// Vaanra uses different env var names for Supabase, wait, let's check .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log('Missing env vars');
    process.exit();
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: product, error } = await supabase
        .from("products")
        .select(`
            *,
            categories:product_categories(
                category:categories(id, name, slug)
            ),
            variants:product_variants(*),
            images:product_images(*)
        `)
        .eq("slug", "supima-t-shirt")
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Product Name:', product.name);
    console.log('Product Images:', product.images);
    console.log('Product Variants:', product.variants.map(v => ({ id: v.id, color: v.color, size: v.size, image_url: v.image_url })));
}

check();
