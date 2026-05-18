import { PlainPage } from "@/components/plain/plain-page";

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  return <PlainPage title="Order Detail" subtitle={`Order ID: ${orderId}`} />;
}
