# DiceBox Campaign Helper · Operations Dashboard

Standalone GitHub Pages application for reviewable Roadmap v2 coordination. The page displays a small public status feed from `public-status.json`; that feed contains only high-level status already published in the authoritative `main` branch.

## Update cadence and authority

The Switchboard reviews the feed after each completed Foreman work turn (up to 20 minutes). It publishes when the public roadmap status changes, and refreshes at least once per day while work is active. The controlling sources are `main` branch Roadmap v2 and the chronological changelog. The dashboard site is deployed from `gh-pages` at the repository root.

## Privacy and browser data

Published files are public. The dashboard's work units, issues, receipts, handoffs, and review history remain in browser-local storage; they are not synchronized through GitHub. Never commit private evidence backups, worker chat IDs, assignments, transcripts, Bridge messages, credentials, or hidden reasoning to `gh-pages`. The branch intentionally contains only site code and the public-safe status feed, not DCH product source.

