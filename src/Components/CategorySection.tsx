"use client";

import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Wheat,
  Soup,
  Mountain,
  Circle,
  Utensils,
  Sparkles,
  GlassWater,
  Package,
} from "lucide-react";

const categories = [
  {
    name: "Edible Oil",
    slug: "edible-oil",
    icon: Droplets,
    description: "Quality cooking oils",
  },
  {
    name: "Atta",
    slug: "atta",
    icon: Wheat,
    description: "Fresh & quality atta",
  },
  {
    name: "Maida",
    slug: "maida",
    icon: Soup,
    description: "Premium quality maida",
  },
  {
    name: "Salt",
    slug: "salt",
    icon: Mountain,
    description: "Essential salt products",
  },
  {
    name: "Cenola Oil",
    slug: "cenola-oil",
    icon: Droplets,
    description: "Cenola cooking oil",
  },
  {
    name: "Sorish Oil",
    slug: "sorish-oil",
    icon: Circle,
    description: "Pure mustard oil",
  },
  {
    name: "Rice",
    slug: "rice",
    icon: Utensils,
    description: "Quality rice products",
  },
  {
    name: "Masala",
    slug: "masala",
    icon: Sparkles,
    description: "Spices & masala",
  },
  {
    name: "Water",
    slug: "water",
    icon: GlassWater,
    description: "Drinking water",
  },
  {
    name: "Other Products",
    slug: "other",
    icon: Package,
    description: "More FMCG products",
  },
];

const ProductCategories = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
            Our Products
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Product Categories
          </h2>

          <p className="mt-3 text-base leading-7 text-gray-600">
            Explore our wide range of quality FMCG products for your retail
            business.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                  {/* Icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-indigo-600 sm:text-lg">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    {category.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    <span>View Products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;