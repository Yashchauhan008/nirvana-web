import { NirvanaHome } from "@/components/home/nirvana-home";
import { listProducts } from "@/services/api/product.api";

export default async function HomePage() {
  const products = await listProducts();
  return <NirvanaHome products={products} />;
}
