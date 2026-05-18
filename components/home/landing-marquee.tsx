"use client";

const landingMarqueeItems = [
  "Bespoke Elegance",
  "Precision Crafted",
  "Japanese Titanium",
  "Hand-Polished Acetate",
  "UV400 Max Protection",
  "Timeless Silhouette",
  "Optical Clarity",
];

export function LandingMarquee() {
  const items = [...landingMarqueeItems, ...landingMarqueeItems];

  return (
    <section data-marquee className="landing-marquee">
      <div className="overflow-hidden">
        <div data-marquee-inner className="landing-marquee__track px-6">
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="landing-marquee__item font-display">
              {item}
              <span className="landing-marquee__dot" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
