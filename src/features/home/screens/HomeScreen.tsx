"use client";

import { useEffect, useMemo, useState } from "react";

import { Layout } from "@/components/layout/Layout";
import { menuApi } from "@/features/menu/services/menu-api";
import type { Category, MenuItem } from "@/features/menu/types";
import { apiClient } from "@/services/api-client";

import { HomeHeroSection } from "@/features/home/components/HomeHeroSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { FeaturedItemsSection } from "@/features/home/components/FeaturedItemsSection";
import { VideoHighlightSection } from "@/features/home/components/VideoHighlightSection";
import { ComboOffersSection } from "@/features/home/components/ComboOffersSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { ReserveCtaSection } from "@/features/home/components/ReserveCtaSection";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [comboOffers, setComboOffers] = useState<Array<{ id: string; name: string; details: string; price: number; image: string }>>([]);
  const [signatureItems, setSignatureItems] = useState<Array<{ id: string; name: string; image: string; category: string; price: number }>>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [categoriesData, featuredData, comboData, signatureData] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getFeaturedItems(),
          apiClient.get<{ data: Array<{ id: string; name: string; details: string; price: number; image: string }> }>("/home/combo-offers"),
          apiClient.get<{ data: Array<{ id: string; name: string; image: string; category: string; price: number }> }>("/home/signature-items"),
        ]);

        setCategories(categoriesData);
        setFeatured(featuredData);
        setComboOffers(comboData.data.data || []);
        setSignatureItems(signatureData.data.data || []);
      } catch {
        setCategories([]);
        setFeatured([]);
        setComboOffers([]);
        setSignatureItems([]);
      }
    };

    void loadHomeData();
  }, []);

  const categoryLabelMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.slug, category.name])),
    [categories],
  );

  return (
    <Layout>
      <HomeHeroSection signaturePicks={signatureItems} categoryLabelMap={categoryLabelMap} />
      <StatsSection />
      <FeaturedItemsSection items={featured} />
      <VideoHighlightSection />
      <ComboOffersSection offers={comboOffers} />
      <TestimonialsSection testimonials={testimonials} />
      <ReserveCtaSection />
    </Layout>
  );
}
