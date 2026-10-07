import { defineCollection, z } from 'astro:content';

// Arc is intentionally unbounded: new arcs must never break the build.
const chapters = defineCollection({
  type: 'content',
  schema: z.object({
    novel: z.string().min(1),
    arc: z.number().int().positive(),
    chapter: z.number().int().positive(),
    title: z.string().min(1),
  }),
});

const novels = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string().min(1),
    originalTitle: z.string().optional(),
    author: z.string().min(1),
    translator: z.string().default('Sakayori Studio'),
    status: z.enum(['ongoing', 'completed', 'hiatus']).default('ongoing'),
    summary: z.string().min(1),
  }),
});

export const collections = { chapters, novels };
