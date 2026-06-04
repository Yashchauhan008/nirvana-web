import { NirvanaHome } from "@/components/home/nirvana-home";
import { listFeaturedProducts } from "@/services/api/product.api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await listFeaturedProducts({ limit: 6 });
  return <NirvanaHome products={featuredProducts} />;
}
