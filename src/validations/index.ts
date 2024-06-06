import { z } from 'zod';

export const idBodySchema = z.object({
  id: z.string().uuid(),
});

export type TIdBodySchema = z.infer<typeof idBodySchema>;
