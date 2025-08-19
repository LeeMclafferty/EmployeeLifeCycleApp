export type NotifyBody = {
    teamId: string; // Team you want to post to
    channelId: string; // e.g. CHANNELS.onboarding
    messageHtml: string; // formatted message
};

export type NotifyResult = { status: string }; // backend returns { status: "ok" }
