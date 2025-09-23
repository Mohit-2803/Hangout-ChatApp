import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

// Validate the webhook payload using the svix library
const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  // Get the headers from the request
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  // Verify the payload using the webhook secret
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (err) {
    console.error("Failed to verify Clerk webhook:", err);
    return undefined;
  }
};

// Handle the Clerk webhook events
const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Invalid payload from Clerk", { status: 400 });
  }

  switch (event.type) {
    // This event is sent when a user is created in Clerk
    case "user.created":
      const existingUser = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });
      if (existingUser) {
        console.log(`User already exists: ${existingUser._id}`);
        return new Response("User already exists", { status: 200 });
      }

      console.log(`Creating new user: ${event.data.id}`);
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url || "",
        clerkId: event.data.id ?? "",
        email: event.data.email_addresses[0]?.email_address || "",
      });
      break;

    // This event is sent when a user is deleted in Clerk
    case "user.deleted":
      const userToDelete = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id ?? "",
      });
      if (userToDelete) {
        console.log(`Deleting user: ${userToDelete._id}`);
        await ctx.runMutation(internal.user.deleteUser, {
          id: userToDelete._id,
        });
      } else {
        console.log(`User not found: ${event.data.id}`);
      }
      break;

    //  Handle other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response("Webhook processed", { status: 200 });
});

const http = httpRouter();

// Route the webhook endpoint
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
