import { PlainPage } from "@/components/plain/plain-page";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <PlainPage title="Product Detail" subtitle={`ID: ${id}`} />;
}
