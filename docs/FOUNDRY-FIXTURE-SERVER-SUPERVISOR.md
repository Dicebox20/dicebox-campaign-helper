# Foundry Fixture Server Supervisor

This repository owns one bounded server lifecycle for the disposable Foundry fixture only:

- data path: `work/foundry-fixture-data-v2`
- world: `dbx-test-world`
- port: `30001`
- Foundry: `14.367`
- D&D5e: `5.3.3`

It never targets the Ballad world and never writes Foundry documents. Process readiness remains separate from browser login, active-GM authority, module readiness, and world-state evidence.

## Commands

```powershell
npm run foundry:fixture:status
npm run foundry:fixture:open
npm run foundry:fixture:start
npm run foundry:fixture:close
npm run foundry:fixture:stop
npm run foundry:fixture:restart
npm run foundry:fixture:recover-lock
```

`open`/`start` and `close`/`stop` are equivalent idempotent pairs. `restart` performs an exact-owned stop, waits for process exit, quarantines only the verified empty runtime lock if necessary, then starts and rereads the new PID/listener/HTTP state.

## Safety and recovery behavior

- The supervisor records its PID, command fingerprint, target root, world, and port under `work/foundry-fixture-data-v2/.dicebox-supervisor/state.json`.
- Every mutating lifecycle command acquires `work/foundry-fixture-data-v2/.dicebox-supervisor/operation.json` atomically. A concurrent command is blocked before spawn or termination. A dead owner's lease is moved to `operation-quarantine`; it is never silently overwritten.
- Close waits for both process exit and the Windows listener-table row to drain before declaring STOPPED; a bounded drain timeout remains outcome-unknown and requires a fresh status reread.
- Status is `PASS` only when the recorded PID is alive, it exclusively owns port `30001`, and HTTP responds with `200` or the expected `302 /join`. Process identity normally requires the exact Windows command line. If CIM command-line access is unavailable, the supervisor accepts only its own current-version state with the exact command fingerprint, Node executable path, and OS process start time.
- Every CLI command, including `status`, writes its machine-readable result to `outputs/foundry-fixture-supervisor-last-receipt.json` by default. Set `DICEBOX_FIXTURE_RECEIPT_PATH` to preserve a command-specific receipt.
- A listener without matching supervisor state is `BLOCKED`; it is never adopted or terminated.
- The Foundry runtime lock is `<dataPath>/Config/options.json.lock`. Worlds and packages remain beneath `<dataPath>/Data`; these roots must not be conflated.
- Lock recovery requires no live or ambiguous owner and an empty lock directory. Recovery moves the directory to `Config/dicebox-lock-quarantine`; it never deletes it.
- An unknown or partial start/stop result must be followed by `status`; do not retry blindly.
- Logs are appended to `Logs/dicebox-fixture-supervisor.stdout.log` and `Logs/dicebox-fixture-supervisor.stderr.log`.

Environment overrides exist for isolated development only: `DICEBOX_FIXTURE_DATA_PATH`, `DICEBOX_FIXTURE_WORLD_ID`, `DICEBOX_FIXTURE_PORT`, `DICEBOX_FOUNDRY_NODE_ENTRY`, and `DICEBOX_FOUNDRY_NODE_PATH`. The launch guard still rejects a default/local live Foundry data path and validates the selected world manifest before spawn.
