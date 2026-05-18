import type { OrderDetails } from "@/types/order.type";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getLineTotalInPaisa(priceInPaisa: number, quantity: number) {
  return (priceInPaisa || 0) * (quantity || 0);
}

function getAddressText(address: Record<string, unknown>) {
  const parts = [
    address.address,
    address.city,
    address.state_name,
    address.postal_code,
  ].filter((value) => typeof value === "string" && value.trim().length > 0);

  return parts.join(", ");
}

function getAddressValue(address: Record<string, unknown>, key: string) {
  const value = address[key];
  if (typeof value !== "string") return "-";
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : "-";
}

function formatCurrencyForPdf(paisa: number) {
  return `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format((paisa || 0) / 100)}`;
}

function getOrderStatusLabel(status: string) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "cancel") return "Cancelled";
  if (normalizedStatus === "complete") return "Complete";
  if (normalizedStatus === "delivered") return "Delivered";
  if (normalizedStatus === "out_for_delivery") return "Out for delivery";
  if (normalizedStatus === "processing") return "Processing";
  return "Pending";
}

function getPaymentStatusLabel(status: string) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "paid") return "Paid";
  if (normalizedStatus === "failed") return "Failed";
  if (normalizedStatus === "partially_paid") return "Partially paid";
  return "Pending";
}

async function getGravisLogoDataUrl() {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/logos/primary.svg");
    if (!response.ok) return null;

    const svgText = await response.text();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Unable to load logo"));
        img.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 180;
      const context = canvas.getContext("2d");
      if (!context) return null;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(logo, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  } catch {
    return null;
  }
}

export async function downloadOrderReceiptPdf(order: OrderDetails) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const logoDataUrl = await getGravisLogoDataUrl();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const dueAmount = order.total_amount_in_paisa - order.paid_amount_in_paisa;
  const isFullyPaid = order.payment_status?.toLowerCase() === "paid";
  const paidLabel = isFullyPaid ? "Token Amount" : "Paid Amount";
  const dueLabel = isFullyPaid
    ? "Other Paid Amount"
    : "Due Amount";
  let currentY = 0;

  doc.setFillColor(1, 55, 172);
  doc.rect(0, 0, pageWidth, 98, "F");

  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(marginX, 20, 150, 54, 8, 8, "F");
    doc.addImage(logoDataUrl, "PNG", marginX + 10, 29, 130, 36);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("GRAVIS", marginX, 56);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ORDER RECEIPT", pageWidth - marginX, 42, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Receipt No: ${order.serial}`, pageWidth - marginX, 60, { align: "right" });
  doc.text(`Issued: ${formatDate(order.created_at)}`, pageWidth - marginX, 76, {
    align: "right",
  });

  currentY = 124;
  doc.setTextColor(30, 41, 59);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, pageWidth - marginX * 2, 88, 8, 8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Order Summary", marginX + 14, currentY + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Order Status: ${getOrderStatusLabel(order.status)}`, marginX + 14, currentY + 42);
  doc.text(
    `Payment Status: ${getPaymentStatusLabel(order.payment_status)}`,
    marginX + 14,
    currentY + 58
  );
  doc.text(
    `Payment Reference: ${order.razorpay_payment_id || "-"}`,
    marginX + 14,
    currentY + 74
  );

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: ${formatCurrencyForPdf(order.total_amount_in_paisa)}`,
    pageWidth - marginX - 14,
    currentY + 32,
    { align: "right" }
  );
  doc.setFont("helvetica", "normal");
  doc.text(
    `${paidLabel}: ${formatCurrencyForPdf(order.paid_amount_in_paisa)}`,
    pageWidth - marginX - 14,
    currentY + 50,
    { align: "right" }
  );
  doc.text(
    `${dueLabel}: ${formatCurrencyForPdf(dueAmount)}`,
    pageWidth - marginX - 14,
    currentY + 68,
    { align: "right" }
  );

  const billingAddress = getAddressText(order.billing_address);
  const shippingAddress = getAddressText(order.shipping_address);
  currentY += 106;

  const addressBoxWidth = (pageWidth - marginX * 2 - 12) / 2;
  const leftBoxX = marginX;
  const rightBoxX = marginX + addressBoxWidth + 12;
  const addressBoxHeight = 100;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftBoxX, currentY, addressBoxWidth, addressBoxHeight, 8, 8, "FD");
  doc.roundedRect(rightBoxX, currentY, addressBoxWidth, addressBoxHeight, 8, 8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Billing Address", leftBoxX + 12, currentY + 20);
  doc.text("Shipping Address", rightBoxX + 12, currentY + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const billingLines = doc.splitTextToSize(billingAddress || "-", addressBoxWidth - 24);
  const shippingLines = doc.splitTextToSize(shippingAddress || "-", addressBoxWidth - 24);
  doc.text(billingLines, leftBoxX + 12, currentY + 38);
  doc.text(shippingLines, rightBoxX + 12, currentY + 38);

  const itemRows = order.items.map((item, index) => [
    String(index + 1),
    item.product_name,
    String(item.quantity),
    formatCurrencyForPdf(item.price_in_paisa),
    formatCurrencyForPdf(getLineTotalInPaisa(item.price_in_paisa, item.quantity)),
  ]);

  autoTable(doc, {
    startY: currentY + addressBoxHeight + 18,
    head: [["#", "Item", "Qty", "Unit Price", "Line Total"]],
    body: itemRows,
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 1,
    },
    headStyles: {
      fillColor: [1, 55, 172],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 28 },
      2: { halign: "center", cellWidth: 50 },
      3: { halign: "right", cellWidth: 105 },
      4: { halign: "right", cellWidth: 105 },
    },
    margin: { left: marginX, right: marginX },
  });

  const finalY = (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 0;
  const totalY = finalY > 0 ? finalY + 24 : pageHeight - 92;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, totalY - 14, pageWidth - marginX * 2, 46, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    `Grand Total: ${formatCurrencyForPdf(order.total_amount_in_paisa)}`,
    pageWidth - marginX - 12,
    totalY + 5,
    {
      align: "right",
    }
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`${dueLabel}: ${formatCurrencyForPdf(dueAmount)}`, marginX + 12, totalY + 5);
  doc.text(
    `Billing Name: ${getAddressValue(order.billing_details, "full_name")}`,
    marginX + 12,
    totalY + 20
  );
  doc.text(`Payment Ref: ${order.razorpay_payment_id || "-"}`, pageWidth - marginX - 12, totalY + 20, {
    align: "right",
  });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  doc.text("This is a computer-generated receipt from Gravis.", marginX, pageHeight - 22);

  doc.save(`${order.serial}-receipt.pdf`);
}
