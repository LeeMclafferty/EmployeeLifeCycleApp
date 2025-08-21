export type NotifyBody = {
    messageHtml: string;
    lifecyclePhase: string;
};

export type NotifyResult = { status: string }; // e.g. "sent"
