import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      link: z.string().url(),
      order: z.number(),
    }),
});

export const collections = { projects };
