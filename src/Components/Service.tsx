"use client";

import {
  Truck,
  PackageCheck,
  BadgeDollarSign,
  Handshake,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your products delivered quickly and efficiently to keep your business moving.",
  },
  {
    icon: PackageCheck,
    title: "Reliable Supply",
    description:
      "Maintain a steady supply of quality FMCG products whenever you need them.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    description:
      "Access competitive distribution prices designed to support your retail business.",
  },
  {
    icon: Handshake,
    title: "Retailer Support",
    description:
      "Dedicated support to help retailers manage orders, products and distribution.",
  },
];

export default function DistributionService() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Distribution You Can{" "}
            <span className="text-primary">Count On</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            We make FMCG distribution simple, reliable and efficient for
            retailers with quality products and dependable service.
          </p>
        </div>

        {/* Service Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Hover gradient */}
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100">
                  Learn more
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                {/* Decorative circle */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-150"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex flex-col items-center gap-3 text-center sm:flex-row">
            <span className="text-sm text-muted-foreground">
              Looking for reliable FMCG distribution?
            </span>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get in Touch
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}