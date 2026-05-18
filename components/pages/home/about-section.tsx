import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto container">
        <div className="grid gap-8 rounded-2xl bg-white px-6 py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:px-10 md:py-10">
          {/* Left: copy */}
          <div className="flex flex-col justify-center gap-5">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
                <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
                About Gravis
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-700 md:text-base">
                Holistic, Personalized, And Innovative Power Solutions For
                Lifelong Reliability
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 md:text-sm">
              <p>
                Gravis has been at the forefront of power generation solutions
                in India for over two decades. We are committed to delivering
                reliable, efficient, and innovative generator systems that keep
                your world running smoothly.
              </p>
              <p>
                From small portable units to large industrial power systems, our
                comprehensive range of generators is designed to meet diverse
                power needs across residential, commercial, and industrial
                sectors. With a strong focus on quality, innovation, and
                customer satisfaction, we have earned the trust of customers
                across the nation.
              </p>
            </div>

            <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center sm:grid-cols-3 sm:text-left">
              <div className="border-b border-slate-200 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
                <div className="text-xl font-extrabold text-slate-900 md:text-2xl">
                  20+
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Years of Excellence
                </div>
              </div>
              <div className="border-b border-slate-200 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
                <div className="text-xl font-extrabold text-slate-900 md:text-2xl">
                  5M+
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Happy Customers
                </div>
              </div>
              <div className="pb-1 sm:pl-4">
                <div className="text-xl font-extrabold text-slate-900 md:text-2xl">
                  500+
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Service Centers
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[#0046B7] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#003690]"
              >
                More Details
                <span aria-hidden>➜</span>
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md h-full">
              <Image
                src="/images/pages/home/about.png"
                alt="Gravis generator system"
                fill
                className="rounded-[32px] object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
