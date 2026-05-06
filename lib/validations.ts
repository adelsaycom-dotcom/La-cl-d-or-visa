import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const agencySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type AgencySchema = z.infer<typeof agencySchema>;

export const visaTypeSchema = z.object({
  countryId: z.string().min(1, { message: "Country is required" }),
  name: z.string().min(2, { message: "Name is required" }),
  price: z.coerce.number().min(0, { message: "Price must be positive" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  validity: z.string().min(1, { message: "Validity is required" }),
  processingTime: z.string().min(1, { message: "Processing time is required" }),
  conditions: z.string().min(1, { message: "Conditions are required" }),
});

export type VisaTypeSchema = z.infer<typeof visaTypeSchema>;
