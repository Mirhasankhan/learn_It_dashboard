import { z } from "zod";

export const receiverEnum = z.enum([
  "AllUsers",
  "Seekers",
  "Experts",
  "SingleUser",
]);

export const notificationSchema = z.object({
  content: z.string().min(1, "Content is required"),
  receiver: receiverEnum,
  userId: z.string().optional(),
}).refine(
  (data) =>
    data.receiver !== "SingleUser" || Boolean(data.userId),
  {
    message: "User is required for SingleUser",
    path: ["userId"],
  }
);

export type NotificationFormData = z.infer<typeof notificationSchema>;
