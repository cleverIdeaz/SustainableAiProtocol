# Security guidance

SAP v0.2 core and lab do not transmit data or collect prompts. Legacy endpoints have **not** been declared production safe.

The original public repository included a tracked \`.env\` file. Its removal from the current Git tree **does not remove it from history**. Every value that was an actual credential must be rotated at its provider (including Stripe, Supabase, and OpenRouter, where applicable), then moved to secure deployment environment configuration. Never paste new secrets into commits, issues or PR discussions.

Legacy \`/api/track\` can accept prompt content; it should be disabled, authenticated, or redesigned before public exposure. Legacy energy and environmental coefficients have not been validated as actual per-request measurements. Do not present them as verified.

Report suspected vulnerabilities privately to the maintainer rather than publishing credential details in an issue.
