
import * as z from "zod";

// Define the form schema with Zod
export const mpesaFormSchema = z.object({
  consumer_key: z.string().min(1, "Consumer Key is required"),
  consumer_secret: z.string().min(1, "Consumer Secret is required"),
  passkey: z.string().min(1, "Passkey is required"),
  shortcode: z.string().min(1, "Shortcode is required").regex(/^\d+$/, "Shortcode must contain only numbers"),
  environment: z.enum(["sandbox", "production"]),
  callback_url: z.string().url("Please enter a valid URL")
});

export type MpesaFormValues = z.infer<typeof mpesaFormSchema>;
