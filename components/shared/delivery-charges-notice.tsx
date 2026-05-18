import Constant from "@/config/constant";

type Props = {
  /** Tighter spacing and slightly smaller type for narrow sidebars (e.g. cart). */
  compact?: boolean;
};

export function DeliveryChargesNotice({ compact }: Props) {
  const { phoneNumber, email } = Constant.contact_details;
  const telHref = `tel:${phoneNumber.replace(/\s/g, "")}`;

  return (
    <div
      className={
        compact
          ? "rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground"
          : "rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground sm:text-sm"
      }
      role="note"
    >
      <p className="font-medium text-foreground">
        Delivery charges are not included in your order total.
      </p>
      <p className={compact ? "mt-1.5" : "mt-2"}>
        You will pay delivery charges when the product is delivered to you.
      </p>
      <p className={compact ? "mt-1.5" : "mt-2"}>
        To know delivery charges for your location, contact us:
      </p>
      <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${compact ? "mt-1.5" : "mt-2"}`}>
        <a href={telHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {phoneNumber}
        </a>
        <span className="text-muted-foreground/70" aria-hidden>
          ·
        </span>
        <a
          href={`mailto:${email}`}
          className="font-medium text-primary underline-offset-4 hover:underline break-all"
        >
          {email}
        </a>
      </p>
    </div>
  );
}
