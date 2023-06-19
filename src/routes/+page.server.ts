import type { EdgeConfig } from "@sveltejs/adapter-vercel";
import type { Post } from "$lib/types";
import { z } from "zod";
import { superValidate, message } from "sveltekit-superforms/server";
import { Email } from "$lib/server/sendEmail";
import { SEND_TO_EMAIL } from "$env/static/private";
import { dev } from "$app/environment";

export const config: EdgeConfig = {
    runtime: "edge"
};

const contactSchema = z.object({
    email: z.string().email(),
    name: z.string().max(50),
    subject: z.string().max(50),
    message: z.string(),
    honeypot: z.string()
});

export const actions = {
    default: async ({ request }) => {
        const contactForm = await superValidate(request, contactSchema);

        if (!contactForm.valid) {
            return message(contactForm, "Invalid form");
        }

        if (contactForm.data.honeypot.length > 0) {
            return message(contactForm, "Honeypot detected.");
        }

        const email = new Email({
            from: { email: "noreply@nilsbeerten.nl", name: `${contactForm.data.name} (${contactForm.data.email})` },
            to: { email: SEND_TO_EMAIL, name: "Nils Beerten" },
            replyTo: { email: contactForm.data.email, name: contactForm.data.name },
            subject: contactForm.data.subject,
            text: contactForm.data.message
        });

        const emailResponse = await email.send(dev);

        console.log(emailResponse);

        if (emailResponse === null && dev) {
            return message(contactForm, "Dev environment cannot send emails.");
        } else if (emailResponse !== null && "statusText" in emailResponse) {
            return message(contactForm, "Failed to send email: " + emailResponse.statusText);
        } else {
            return message(contactForm, "Succesfully sent! Thanks!");
        }
    }
};

export async function load({ fetch }) {
    const contactForm = await superValidate(contactSchema);

    const tmRefreshLeaderboardDownloads = fetch("https://openplanet.dev/api/plugin/229", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "nilsbeerten.nl/1.0 (https://github.com/nbeerten/nilsbeerten.nl)"
        }
    }).then(
        (res) =>
            res.json() as Promise<
                Record<string, unknown> & {
                    downloads: number;
                }
            >
    );

    const posts: Promise<Post[]> = fetch("/api/posts").then((res) => res.json());

    return {
        contactForm,
        streamed: {
            tmRefreshLeaderboardDownloads,
            posts
        }
    };
}
