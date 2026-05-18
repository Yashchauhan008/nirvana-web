import { z } from "zod";

const uuidString = z
  .uuid({ version: "v7", message: "Invalid UUID" });

/** option_id from query: single string or array of strings → array of UUIDs */
const optionIdArray = z
  .union([
    z.string().transform((v) => (v ? [v] : [])),
    z.array(z.string()).transform((arr) => arr.filter(Boolean)),
  ])
  .optional()
  .default([])
  .pipe(z.array(uuidString).catch(() => []));

export const productListQuerySchema = z.object({
  category_id: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(
      z
        .string()
        .uuid({ version: "v7", message: "Invalid category ID" })
        .optional()
    ),
  search: z.string().trim().toLowerCase().optional(),
  /** Filter by these filter-option IDs (product must match selected options). */
  option_ids: optionIdArray,
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
