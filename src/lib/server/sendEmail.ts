import { dev } from "$app/environment";
import { DKIM_PRIVATE_KEY, SEND_TO_EMAIL, NOREPLY_EMAIL } from "$env/static/private";

export type IContact = {
    email: string;
    name?: string;
};

export interface IEmail {
    to: IContact;
    replyTo?: IContact;
    cc?: IContact;
    bcc?: IContact;
    from: IContact;
    subject: string;
    text?: string;
    html?: string;
}

export type MailSendBody = {
    content: { type: string; value: string }[];
    from: { email: string; name?: string };
    /**
     * Must not be one of the reserved headers (received, dkim-signature, Content-Type, Content-Transfer-Encoding, To, From, Subject, Reply-To, CC, BCC).
     */
    headers?: Record<string, string>;
    mailfrom?: { email: string; name?: string };
    personalizations: {
        bcc?: { email: string; name?: string }[];
        cc?: { email: string; name?: string }[];
        dkim_domain?: string;
        dkim_private_key?: string;
        dkim_selector?: string;
        from?: { email: string; name?: string };
        headers?: Record<string, string>;
        reply_to?: { email: string; name?: string };
        subject?: string;
        to: { email: string; name?: string }[];
    }[];
    reply_to?: { email: string; name?: string };
    subject: string;
};

export class Email {
    protected from: IContact;
    protected to: IContact;
    protected replyTo?: IContact;
    protected cc?: IContact;
    protected bcc?: IContact;
    protected subject: string;
    protected text?: string;
    protected html?: string;

    constructor(email: Partial<IEmail>) {
<<<<<<< HEAD
        this.from = email.from ?? { email: NOREPLY_EMAIL, name: "Nils Beerten (noreply)" };
=======
        this.from = email.from ?? { email: "noreply@nilsbeerten.nl", name: "Nils Beerten (noreply)" };
>>>>>>> 115c7a0e97754a70e7869422b6c0f46eece3afcc
        this.to = email.to ?? { email: SEND_TO_EMAIL };
        this.replyTo = email.replyTo;
        this.cc = email.cc;
        this.bcc = email.bcc;
        this.subject = email.subject ?? "Test Subject";
        this.text = email.text;
        this.html = email.html;
    }

    async send(dev?: boolean) {
        const content = [
            {
                type: this.text ? "text/plain" : "text/html",
                value: this.text ? this.text : this.html ? this.html : ""
            }
        ];

        const request = new Request("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [this.to],
                        dkim_domain: "nilsbeerten.nl",
                        dkim_selector: "mailchannels",
                        dkim_private_key: DKIM_PRIVATE_KEY
                    }
                ],
                from: this.from,
                reply_to: this.replyTo,
                subject: this.subject,
                content: content
            } satisfies MailSendBody)
        });

        if (dev) {
            console.log(request);
            return null;
        } else {
            const response = await fetch(request);

            if (response.ok) {
                const responseData = (await response.json()) as null | Record<string, unknown>;
                return responseData;
            } else {
                return {
                    status: response.status,
                    statusText: response.statusText
                };
            }
        }
    }
}

export default async function sendEmail(email: Partial<IEmail>) {
    if (dev) return null;

    const fallback: IEmail = {
        from: {
            email: "test@nilsbeerten.nl",
            name: "Test Sender"
        },
        to: {
            email: SEND_TO_EMAIL
        },
        subject: "Test Subject",
        text: "Test message content"
    };

    const emailData = { ...fallback, ...email };

    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [emailData.to],
                    dkim_domain: "nilsbeerten.nl",
                    dkim_selector: "mailchannels",
                    dkim_private_key: DKIM_PRIVATE_KEY
                }
            ],
            from: emailData.from,
            subject: emailData.subject,
            content: [
                {
                    type: "text/plain",
                    value: emailData.text
                }
            ]
        })
    });
    const data = await response.text();

    return data;
}
