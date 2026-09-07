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
      // Absent for projects that have a case study page of their own: the card
      // then points at /work/<id> instead of straight out to the live site.
      link: z.string().url().optional(),
      order: z.number(),
    }),
});

export const collections = { projects };
