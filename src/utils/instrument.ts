import * as Sentry from "@sentry/react";
import manifest from "../../manifest.json";

function startSentry(): void {
    if (typeof process.env.SENTRY_DSN !== 'string') {
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        release: manifest.version,
        integrations: [
            Sentry.replayIntegration(),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
        // tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
}

startSentry();