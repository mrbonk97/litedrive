import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/policy", siteUrl).toString(),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: new URL("/privacy", siteUrl).toString(),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
