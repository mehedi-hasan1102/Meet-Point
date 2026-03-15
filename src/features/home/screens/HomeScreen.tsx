"use client";

import { Layout } from "@/components/layout/Layout";
import { categories, menuItems } from "@/mocks/menu";
import signaturePicks from "@/features/home/content/signature-picks.json";
import featuredItems from "@/features/home/content/featured-items.json";

import { HomeHeroSection } from "@/features/home/components/HomeHeroSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { FeaturedItemsSection } from "@/features/home/components/FeaturedItemsSection";
import { VideoHighlightSection } from "@/features/home/components/VideoHighlightSection";
import { ComboOffersSection } from "@/features/home/components/ComboOffersSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { ReserveCtaSection } from "@/features/home/components/ReserveCtaSection";

const categoryLabelMap = Object.fromEntries(categories.map((category) => [category.slug, category.name]));

const comboOffers = [
  {
    name: "ফ্যামিলি কম্বো",
    details: "২টি বার্গার, ১টি উইংস প্ল্যাটার, ২টি ড্রিংকস",
    price: 34.99,
    image: menuItems[6].image,
  },
  {
    name: "কাপল ডিলাইট",
    details: "১টি স্টেক, ১টি সালমন, ২টি ফ্রেশ জুস",
    price: 49.99,
    image: menuItems[4].image,
  },
  {
    name: "স্ন্যাক টাইম বক্স",
    details: "ক্যালামারি, ব্রুশকেটা, লেমনেড",
    price: 21.99,
    image: menuItems[0].image,
  },
];

const testimonials = [
  {
    name: "নাদিয়া আক্তার",
    comment:
      "খাবারের মান এবং সার্ভিস দুটোই অসাধারণ। ফ্যামিলি প্ল্যাটারটি আমাদের সাপ্তাহিক ডিনারের জন্য একদম পারফেক্ট ছিল।",
  },
  {
    name: "মাসুদ রানা",
    comment: "ডেলিভারি খুব দ্রুত ছিল এবং বার্গার কম্বো গরম অবস্থায় পৌঁছেছে। আবার অবশ্যই অর্ডার করব।",
  },
  {
    name: "জেরিন সুলতানা",
    comment: "পরিষ্কার পরিবেশ, সুস্বাদু খাবার আর আন্তরিক স্টাফ। এখন এটা আমার খুব পছন্দের একটি জায়গা।",
  },
];

export default function HomeScreen() {
  return (
    <Layout>
      <HomeHeroSection signaturePicks={signaturePicks} categoryLabelMap={categoryLabelMap} />
      <StatsSection />
      <FeaturedItemsSection items={featuredItems} />
      <VideoHighlightSection />
      <ComboOffersSection offers={comboOffers} />
      <TestimonialsSection testimonials={testimonials} />
      <ReserveCtaSection />
    </Layout>
  );
}
