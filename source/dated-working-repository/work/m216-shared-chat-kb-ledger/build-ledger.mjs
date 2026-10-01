import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import crypto from "node:crypto";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const sourceLog = "C:/Users/rujie/.codex/sessions/2026/08/24/rollout-2026-08-24T10-46-37-01a034e1-a293-7c93-80d4-4bd111d38ffe.jsonl";
const outputDir = "C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/outputs/01a034e1-a293-7c93-80d4-4bd111d38ffe";
const outputPath = path.join(outputDir, "dicebox-shared-chat-knowledge-ledger-M216.xlsx");

const constants = {
  title: "DiceBox Campaign Helper — Shared Chat & Knowledge Ledger",
  currentThreadId: "01a034e1-a293-7c93-80d4-4bd111d38ffe",
  predecessorThreadId: "01a0231c-57b9-76c3-ba81-12dbac16fddc",
  ideaDocumentId: "14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o",
  ideaDocumentUrl: "https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit",
  ideaDocumentRevision: "AIroW35gMahDPVx8uUFhUtHAzE0qHqaxHig7fCiYFnk256CSZi89wsGXdICLavW_0kbbU72mo9d7N4J1U_XfiGad8JOJH6970IQvBOrsWMY",
  kbDriveId: "1I6UAxFEOyRdrXnVRthIUQe81w5ywIq0W",
  kbDriveUrl: "https://drive.google.com/file/d/1I6UAxFEOyRdrXnVRthIUQe81w5ywIq0W/view",
  kbFileName: "dicebox_campaign_helper_knowledge-M216-2026-08-24.sqlite",
  kbMimeType: "application/vnd.sqlite3",
  kbBytes: 3235840,
  kbSha256: "610420387C7D487ECBD97BD3CF5862033403AD7C64DDADDB069B8E75C17F41FE",
  schemaSha256: "B9FB21EA8B3974A56F44ED52CB8434EB9EC8B9617DC1E3928575399EDF254333",
  seedSha256: "6C8E23093FD90E2338343574BC14F8660830627A22FAF92450780D535EDE68E7",
  roadmapSha256: "824F9011642A4857CA169D0D58967065CC3BFC35A089E186F8A5EF98CE10F293",
  activeCardSha256: "139C01CF579BE07B9BAA7D166C777DB45B80EC3B48119E17496EDF609D71AE20",
  kbCounts: "269 sources; 305 facts; 255 decisions; 135 open items; 268 trials; 40 subjects; 26 milestones",
};

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex").toUpperCase();
}

function cleanCell(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

function messageText(payload) {
  return (payload.content ?? []).map((item) => item.text ?? "").join("");
}

function classifyUser(text) {
  if (text.startsWith("<codex_delegation>")) return "task_delegation";
  if (text.startsWith("<recommended_plugins>") || text.startsWith("# AGENTS.md instructions")) return "application_context";
  if (text.startsWith("<codex_internal_context")) return "goal_context";
  if (text.startsWith("<subagent_notification>")) return "worker_notification";
  return "user_authored";
}

function eventClassification(record) {
  const payload = record.payload ?? {};
  if (record.type === "response_item" && payload.type === "message") {
    if (payload.role === "user" || payload.role === "assistant") return "shared_message_text";
    return "developer_instruction_excluded";
  }
  if (record.type === "response_item" && payload.type === "reasoning") return "hidden_reasoning_excluded";
  if (record.type === "response_item" && (payload.type === "custom_tool_call" || payload.type === "function_call")) return "tool_input_excluded";
  if (record.type === "response_item" && (payload.type === "custom_tool_call_output" || payload.type === "function_call_output")) return "tool_output_excluded";
  if (record.type === "world_state") return "world_state_payload_excluded";
  if (record.type === "compacted") return "compaction_payload_excluded";
  if (record.type === "turn_context") return "turn_context_summary_excluded";
  if (record.type === "event_msg" && payload.type === "item_completed") return "completed_item_payload_excluded";
  if (record.type === "session_meta") return "session_metadata_sanitized";
  return "metadata_only";
}

function eventNote(classification) {
  const notes = {
    shared_message_text: "Exact text appears in Chat Messages.",
    developer_instruction_excluded: "Developer/runtime instruction text is not shared; event identity and record hash are retained.",
    hidden_reasoning_excluded: "Private reasoning and encrypted reasoning content are not exported.",
    tool_input_excluded: "Tool input can contain local paths or sensitive context; only metadata, size, and hash are exported.",
    tool_output_excluded: "Raw tool output is omitted; only metadata, size, and hash are exported.",
    world_state_payload_excluded: "Runtime-owned world-state payload is omitted; record metadata and hash remain.",
    compaction_payload_excluded: "Internal compaction replacement history is omitted; window metadata and record hash remain.",
    turn_context_summary_excluded: "Internal turn summary/instruction context is omitted; safe routing metadata and record hash remain.",
    completed_item_payload_excluded: "Duplicated completed-item payload is omitted; event metadata and record hash remain.",
    session_metadata_sanitized: "Only allowlisted session fields appear on Overview.",
    metadata_only: "No additional payload text is required for the shared ledger.",
  };
  return notes[classification] ?? "";
}

function deriveTurn(payload) {
  return payload?.turn_id ?? payload?.internal_chat_message_metadata_passthrough?.turn_id ?? payload?.item?.turn_id ?? "";
}

function deriveEntity(payload) {
  return payload?.id ?? payload?.item?.id ?? payload?.call_id ?? payload?.item?.call_id ?? "";
}

function deriveName(payload) {
  return payload?.name ?? payload?.item?.name ?? payload?.item?.tool ?? "";
}

function deriveStatus(payload) {
  const status = payload?.status ?? payload?.item?.status ?? "";
  return typeof status === "string" ? status : cleanCell(JSON.stringify(status));
}

function payloadChars(record, line) {
  const payload = record.payload ?? {};
  if (record.type === "response_item" && payload.type === "message") return messageText(payload).length;
  if (payload.type === "custom_tool_call") return cleanCell(payload.input).length;
  if (payload.type === "custom_tool_call_output") return cleanCell(payload.output).length;
  if (payload.type === "function_call") return cleanCell(payload.arguments).length;
  if (payload.type === "function_call_output") return cleanCell(payload.output).length;
  if (payload.type === "reasoning") return cleanCell(payload.encrypted_content).length + cleanCell(JSON.stringify(payload.summary ?? [])).length;
  return line.length;
}

const messages = [];
const events = [];
const completedTextByTurn = new Map();
const counts = new Map();
let sessionMeta = null;
let sourceBytes = 0;
let sourceLines = 0;
let maxOrdinal = 0;
const sourceHash = crypto.createHash("sha256");
const input = fs.createReadStream(sourceLog);
input.on("data", (chunk) => {
  sourceHash.update(chunk);
  sourceBytes += chunk.length;
});

const rl = readline.createInterface({ input, crlfDelay: Infinity });
for await (const line of rl) {
  if (!line) continue;
  sourceLines += 1;
  const record = JSON.parse(line);
  const payload = record.payload ?? {};
  maxOrdinal = Math.max(maxOrdinal, Number(record.ordinal) || 0);
  const countKey = `${record.type}:${payload.type ?? ""}`;
  counts.set(countKey, (counts.get(countKey) ?? 0) + 1);
  if (record.type === "session_meta") sessionMeta = payload;
  if (record.type === "event_msg" && payload.type === "task_complete" && payload.turn_id && payload.last_agent_message) {
    completedTextByTurn.set(payload.turn_id, payload.last_agent_message);
  }

  const classification = eventClassification(record);
  const duration = payload.duration_ms ?? (
    Number.isFinite(payload.completed_at_ms) && Number.isFinite(payload.started_at_ms)
      ? payload.completed_at_ms - payload.started_at_ms
      : ""
  );
  events.push([
    `evt:${String(record.ordinal).padStart(6, "0")}`,
    Number(record.ordinal) || 0,
    cleanCell(record.timestamp),
    cleanCell(record.type),
    cleanCell(payload.type),
    cleanCell(deriveTurn(payload)),
    cleanCell(deriveEntity(payload)),
    cleanCell(deriveName(payload)),
    cleanCell(deriveStatus(payload)),
    duration === "" ? "" : Number(duration),
    classification,
    payloadChars(record, line),
    line.length,
    sha256(line),
    eventNote(classification),
  ]);

  if (record.type === "response_item" && payload.type === "message" && (payload.role === "user" || payload.role === "assistant")) {
    const originalText = messageText(payload);
    const storedText = cleanCell(originalText);
    const turnId = cleanCell(deriveTurn(payload));
    messages.push({
      ordinal: Number(record.ordinal) || 0,
      timestamp: cleanCell(record.timestamp),
      turnId,
      messageId: cleanCell(payload.id),
      sourceClass: payload.role === "user" ? classifyUser(originalText) : "assistant_message",
      role: payload.role,
      kind: payload.role === "user" ? "input_text" : "assistant_commentary",
      sharedStatus: "shared_exact",
      text: storedText,
      chars: originalText.length,
      contentSha256: sha256(originalText),
      storedSha256: sha256(storedText),
      recordSha256: sha256(line),
      notes: originalText === storedText ? "Exact source text retained." : "Unsupported XML control characters were removed; original digest retained.",
    });
  }
}

const sourceSha256 = sourceHash.digest("hex").toUpperCase();
for (const message of messages) {
  if (message.role === "assistant" && completedTextByTurn.get(message.turnId) === message.text) {
    message.kind = "assistant_final";
  }
}

const messageRows = messages.map((message, index) => [
  `chat:${String(index + 1).padStart(4, "0")}`,
  message.ordinal,
  message.timestamp,
  message.turnId,
  message.messageId,
  message.sourceClass,
  message.role,
  message.kind,
  message.sharedStatus,
  message.text,
  message.chars,
  message.contentSha256,
  message.storedSha256,
  message.recordSha256,
  message.notes,
]);

const transcriptDigest = sha256(messages.map((m) => `${m.ordinal}\u0000${m.role}\u0000${m.contentSha256}`).join("\n"));
const roleCounts = messages.reduce((acc, message) => {
  acc[message.role] = (acc[message.role] ?? 0) + 1;
  return acc;
}, {});
const userClassCounts = messages.filter((m) => m.role === "user").reduce((acc, message) => {
  acc[message.sourceClass] = (acc[message.sourceClass] ?? 0) + 1;
  return acc;
}, {});
const eventCountJson = JSON.stringify(Object.fromEntries([...counts.entries()].sort()), null, 0);

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Overview");
const chat = workbook.worksheets.add("Chat Messages");
const taskEvents = workbook.worksheets.add("Task Events");
const kb = workbook.worksheets.add("KB Linkage");
const sync = workbook.worksheets.add("Sync Log");

const headerFormat = {
  fill: "#F1F3F4",
  font: { bold: true, color: "#202124" },
  borders: { preset: "doubleBottom", style: "thin", color: "#DADCE0" },
  verticalAlignment: "center",
  wrapText: true,
};
const titleFormat = {
  fill: "#E8F0FE",
  font: { bold: true, color: "#174EA6" },
  borders: { preset: "outside", style: "thin", color: "#D2E3FC" },
  verticalAlignment: "center",
};
const sectionFormat = {
  fill: "#F8F9FA",
  font: { bold: true, color: "#3C4043" },
  borders: { bottom: { style: "thin", color: "#DADCE0" } },
};

overview.showGridLines = false;
overview.getRange("A1:C1").merge();
overview.getRange("A1").values = [[constants.title]];
overview.getRange("A1:C1").format = titleFormat;
overview.getRange("A2:C2").merge();
overview.getRange("A2").values = [["Point-in-time exchange snapshot for the ChatGPT-side collaborator. The local schema-plus-seed knowledge base remains canonical."]];
overview.getRange("A2:C2").format = { fill: "#F8F9FA", font: { italic: true, color: "#5F6368" }, wrapText: true };
overview.getRange("A4:C4").values = [["Field", "Value", "Verification / Notes"]];
overview.getRange("A4:C4").format = headerFormat;
const overviewRows = [
  ["Ledger status", "M216 implementation snapshot", "Roadmap, idea document, and KB gates passed before creation."],
  ["Current task ID", constants.currentThreadId, "Codex Desktop session identity."],
  ["Predecessor task ID", constants.predecessorThreadId, "Lineage only; predecessor transcript is not copied into this current-task snapshot."],
  ["Session origin", cleanCell(sessionMeta?.originator), `CLI ${cleanCell(sessionMeta?.cli_version)}; source ${cleanCell(sessionMeta?.source)}; history ${cleanCell(sessionMeta?.history_mode)}`],
  ["Session created UTC", cleanCell(sessionMeta?.timestamp), "Exact session metadata value."],
  ["Workspace", cleanCell(sessionMeta?.cwd), "Local path; not accessible from ChatGPT unless separately shared."],
  ["Snapshot maximum source ordinal", maxOrdinal, "All JSONL records read through this ordinal are represented in Task Events."],
  ["Source JSONL lines", sourceLines, "Must equal Task Events data-row count."],
  ["Source JSONL bytes read", sourceBytes, "Exact bytes consumed by this extraction pass."],
  ["Source JSONL SHA-256", sourceSha256, "Hash of exact bytes consumed; the live Codex log can grow after this point."],
  ["Shared chat messages", messageRows.length, "All available response_item message records whose role is user or assistant."],
  ["User-role messages", roleCounts.user ?? 0, `Source classes: ${JSON.stringify(userClassCounts)}`],
  ["Assistant messages", roleCounts.assistant ?? 0, "Assistant final answers are identified from task_complete metadata; others are commentary."],
  ["Developer messages excluded", counts.get("response_item:message") - messageRows.length, "Text not exported; metadata and record hashes remain in Task Events."],
  ["Task event rows", events.length, "One metadata row for every source JSONL record, including shared messages."],
  ["Transcript manifest SHA-256", transcriptDigest, "Digest of ordered message ordinal, role, and content digest tuples."],
  ["Hidden reasoning", `${counts.get("response_item:reasoning") ?? 0} events excluded`, "No reasoning summary, encrypted content, or private chain-of-thought is shared."],
  ["Tool records", `${counts.get("response_item:custom_tool_call") ?? 0} calls; ${counts.get("response_item:custom_tool_call_output") ?? 0} outputs; ${counts.get("response_item:function_call") ?? 0} function calls; ${counts.get("response_item:function_call_output") ?? 0} function outputs`, "Raw inputs/outputs omitted; metadata, length, and record hash retained."],
  ["Compaction records", `${counts.get("compacted:") ?? 0} payloads excluded`, "Window metadata and record hashes remain; internal replacement history is omitted."],
  ["Event distribution", eventCountJson, "Exact record-type counts at the snapshot boundary."],
  ["Idea document", constants.ideaDocumentUrl, `Exact ID ${constants.ideaDocumentId}; accepted-change revision ${constants.ideaDocumentRevision}`],
  ["Knowledge-base snapshot", constants.kbDriveUrl, `${constants.kbFileName}; Drive ID ${constants.kbDriveId}; owner-only metadata observed at upload.`],
  ["Canonical KB rule", "database/schema.sql + database/seed.sql → verified SQLite", "The Sheet and Drive upload are exchange evidence, never a KB write path or runtime authority."],
  ["Workbook self-hash", "Recorded externally after export", "Embedding a workbook's own hash would change the workbook and invalidate that hash."],
];
overview.getRangeByIndexes(4, 0, overviewRows.length, 3).values = overviewRows;
overview.getRange(`A5:A${4 + overviewRows.length}`).format = { font: { bold: true }, fill: "#FAFAFA", verticalAlignment: "top" };
overview.getRange(`B5:C${4 + overviewRows.length}`).format = { wrapText: true, verticalAlignment: "top" };
overview.getRange("B9").format.numberFormat = 'yyyy-mm-dd"T"hh:mm:ss.000"Z"';
overview.getRange("A29:C29").values = [["Formula checks", "Value", "Expected"]];
overview.getRange("A29:C29").format = sectionFormat;
overview.getRange("A30:A33").values = [["Chat rows"], ["User-role rows"], ["Assistant rows"], ["Task event rows"]];
overview.getRange("B30").formulas = [[`=COUNTA('Chat Messages'!$A$2:$A$${messageRows.length + 1})`]];
overview.getRange("B31").formulas = [[`=COUNTIF('Chat Messages'!$G$2:$G$${messageRows.length + 1},"user")`]];
overview.getRange("B32").formulas = [[`=COUNTIF('Chat Messages'!$G$2:$G$${messageRows.length + 1},"assistant")`]];
overview.getRange("B33").formulas = [[`=COUNTA('Task Events'!$A$2:$A$${events.length + 1})`]];
overview.getRange("C30:C33").values = [[messageRows.length], [roleCounts.user ?? 0], [roleCounts.assistant ?? 0], [events.length]];
overview.getRange("A30:A33").format = { font: { bold: true } };
overview.getRange("B30:C33").format.numberFormat = "#,##0";
overview.getRange("A1:C33").format.wrapText = true;
overview.getRange("A1:C33").format.verticalAlignment = "top";
overview.getRange("A:A").format.columnWidthPx = 220;
overview.getRange("B:B").format.columnWidthPx = 520;
overview.getRange("C:C").format.columnWidthPx = 420;
overview.freezePanes.freezeRows(4);

const chatHeaders = [["Row ID", "Ordinal", "Timestamp UTC", "Turn ID", "Message ID", "Source Class", "Role", "Message Kind", "Shared Status", "Content", "Content Chars", "Original Content SHA-256", "Stored Content SHA-256", "Source Record SHA-256", "Notes"]];
chat.getRange("A1:O1").values = chatHeaders;
chat.getRange("A1:O1").format = headerFormat;
chat.getRangeByIndexes(1, 0, messageRows.length, 15).values = messageRows;
chat.getRange(`C2:C${messageRows.length + 1}`).format.numberFormat = 'yyyy-mm-dd"T"hh:mm:ss.000"Z"';
chat.getRange(`A2:O${messageRows.length + 1}`).format.verticalAlignment = "top";
chat.getRange(`J2:J${messageRows.length + 1}`).format = { wrapText: true, verticalAlignment: "top" };
chat.getRange(`N2:O${messageRows.length + 1}`).format.wrapText = true;
chat.getRange("A:A").format.columnWidthPx = 110;
chat.getRange("B:B").format.columnWidthPx = 75;
chat.getRange("C:C").format.columnWidthPx = 175;
chat.getRange("D:E").format.columnWidthPx = 255;
chat.getRange("F:I").format.columnWidthPx = 150;
chat.getRange("J:J").format.columnWidthPx = 680;
chat.getRange("K:K").format.columnWidthPx = 95;
chat.getRange("L:N").format.columnWidthPx = 290;
chat.getRange("O:O").format.columnWidthPx = 270;
chat.getRange(`A2:O${messageRows.length + 1}`).format.rowHeightPx = 72;
chat.freezePanes.freezeRows(1);
chat.freezePanes.freezeColumns(2);

const eventHeaders = [["Event ID", "Ordinal", "Timestamp UTC", "Record Type", "Payload Type", "Turn ID", "Entity ID", "Tool / Name", "Status", "Duration ms", "Payload Classification", "Payload Chars", "Record Chars", "Source Record SHA-256", "Notes"]];
taskEvents.getRange("A1:O1").values = eventHeaders;
taskEvents.getRange("A1:O1").format = headerFormat;
taskEvents.getRangeByIndexes(1, 0, events.length, 15).values = events;
taskEvents.getRange(`C2:C${events.length + 1}`).format.numberFormat = 'yyyy-mm-dd"T"hh:mm:ss.000"Z"';
taskEvents.getRange(`A2:O${events.length + 1}`).format.verticalAlignment = "top";
taskEvents.getRange(`O2:O${events.length + 1}`).format.wrapText = true;
taskEvents.getRange("A:A").format.columnWidthPx = 115;
taskEvents.getRange("B:B").format.columnWidthPx = 75;
taskEvents.getRange("C:C").format.columnWidthPx = 175;
taskEvents.getRange("D:E").format.columnWidthPx = 150;
taskEvents.getRange("F:G").format.columnWidthPx = 255;
taskEvents.getRange("H:K").format.columnWidthPx = 165;
taskEvents.getRange("L:M").format.columnWidthPx = 100;
taskEvents.getRange("N:N").format.columnWidthPx = 290;
taskEvents.getRange("O:O").format.columnWidthPx = 390;
taskEvents.freezePanes.freezeRows(1);
taskEvents.freezePanes.freezeColumns(2);

kb.getRange("A1:D1").values = [["Field", "Value", "Verification / Authority", "Notes"]];
kb.getRange("A1:D1").format = headerFormat;
const kbRows = [
  ["Canonical build", "python database/build_database.py", "M216 integrity ok", "Builds from database/schema.sql plus database/seed.sql."],
  ["Verification", "python database/verify_database.py", "Integrity ok; 12 activity hits; 106 active work", "Read-only verification after rebuild."],
  ["KB snapshot Drive URL", constants.kbDriveUrl, "Connector upload and metadata readback PASS", "Read-only exchange artifact; not a write path."],
  ["KB snapshot Drive ID", constants.kbDriveId, "Exact connector-observed ID", constants.kbFileName],
  ["KB MIME type", constants.kbMimeType, "Connector metadata", "Native SQLite file stored in Drive."],
  ["KB size bytes", constants.kbBytes, "Connector metadata equals local verified file size", ""],
  ["KB SHA-256", constants.kbSha256, "Local M216 verified artifact", "Hash is authoritative for this uploaded snapshot."],
  ["Schema SHA-256", constants.schemaSha256, "Local M216 source", "database/schema.sql"],
  ["Seed SHA-256", constants.seedSha256, "Local M216 source", "database/seed.sql"],
  ["KB record counts", constants.kbCounts, "M216 rebuild", "Open-item count remains unchanged."],
  ["M216 source", "SRC-M216-SHARED-CHAT-KB-BRIDGE", "Active source", "Accepted bridge boundary."],
  ["M216 fact", "F-290", "Active fact", "Synchronized shared chat and reproducible-KB bridge."],
  ["M216 decision", "D-250", "Locked decision", "Only this bounded bridge is authorized."],
  ["M216 trial", "T-263", "PASS PREIMPLEMENTATION", "Includes stale-revision recovery and explicit transcript exclusions."],
  ["M216 relationships", "R-1457 through R-1466", "Rebuilt and queryable", "Connects D-250 to D-233, D-249, O-116, and O-130."],
  ["Roadmap SHA-256 at artifact build", constants.roadmapSha256, "Local file", "Closure updates after artifact creation will produce a later hash."],
  ["Active card SHA-256 at artifact build", constants.activeCardSha256, "Local file", "Closure updates after artifact creation will produce a later hash."],
  ["Idea document", constants.ideaDocumentUrl, `Revision ${constants.ideaDocumentRevision}`, "Exact ID/title/Tab 1; 15 native date elements; no private-use controls at accepted-change readback."],
  ["Current Codex task", constants.currentThreadId, "Current transcript source", "This workbook snapshots available current-task records only."],
  ["Predecessor task", constants.predecessorThreadId, "Lineage reference", "Not copied into this workbook."],
  ["Authority boundary", "Local schema + seed rebuild", "Canonical", "Google Sheet and Drive SQLite snapshot are communication/evidence surfaces only."],
  ["Permissions boundary", "Owner-only metadata observed", "Drive metadata: shared=false; owner Rujiel@gmail.com", "No public/domain permission was added."],
];
kb.getRangeByIndexes(1, 0, kbRows.length, 4).values = kbRows;
kb.getRange(`A2:A${kbRows.length + 1}`).format = { font: { bold: true }, fill: "#FAFAFA" };
kb.getRange(`A1:D${kbRows.length + 1}`).format.wrapText = true;
kb.getRange(`A1:D${kbRows.length + 1}`).format.verticalAlignment = "top";
kb.getRange("A:A").format.columnWidthPx = 225;
kb.getRange("B:B").format.columnWidthPx = 520;
kb.getRange("C:C").format.columnWidthPx = 340;
kb.getRange("D:D").format.columnWidthPx = 390;
kb.freezePanes.freezeRows(1);

sync.getRange("A1:G1").values = [["Sequence", "Timestamp UTC", "Gate / Action", "Status", "Evidence", "SHA / Revision / ID", "Notes"]];
sync.getRange("A1:G1").format = headerFormat;
const syncRows = [
  [1, "2026-08-25T04:20:06.180Z", "Accepted change", "PASS", "User requested a shared database document linked to the KB with current-task chat data and metadata.", "D-250", "Detach recovery preserved but parked."],
  [2, "2026-08-25T04:20:06.180Z", "Roadmap and active checklist", "PASS", "Shared chat/KB bridge scope, acceptance observation, exclusions, and parked work recorded.", `${constants.roadmapSha256} / ${constants.activeCardSha256}`, "Machine workflow check passed."],
  [3, "2026-08-25T04:20:06.180Z", "Shared idea document", "PASS", "Revision-guarded native-date append and connector readback after one safe stale-revision rejection.", constants.ideaDocumentRevision, "Exact document ID/title/Tab 1; 15 dates; no private-use markers."],
  [4, "2026-08-25T04:20:06.180Z", "M216 KB rebuild and verification", "PASS", constants.kbCounts, constants.kbSha256, "Schema-plus-seed canonical authority retained."],
  [5, "2026-08-25T04:33:46.291Z", "KB snapshot upload", "PASS", `${constants.kbFileName}; ${constants.kbBytes} bytes; connector metadata readback`, constants.kbDriveId, "Owner-only; shared=false; no public/domain permission added."],
  [6, new Date().toISOString(), "Transcript extraction", "PASS", `${messageRows.length} shared messages and ${events.length} event metadata rows through ordinal ${maxOrdinal}`, `${sourceSha256} / ${transcriptDigest}`, "Point-in-time snapshot; live Codex log can grow afterward."],
  [7, new Date().toISOString(), "Workbook creation", "IN PROGRESS AT EXPORT", "Five required surfaces authored and locally verified before native import.", "Workbook SHA recorded after export", "Native Google Sheets ID/URL will be connector-observed after import."],
];
sync.getRangeByIndexes(1, 0, syncRows.length, 7).values = syncRows;
sync.getRange(`B2:B${syncRows.length + 1}`).format.numberFormat = 'yyyy-mm-dd"T"hh:mm:ss.000"Z"';
sync.getRange(`A1:G${syncRows.length + 1}`).format.wrapText = true;
sync.getRange(`A1:G${syncRows.length + 1}`).format.verticalAlignment = "top";
sync.getRange("A:A").format.columnWidthPx = 80;
sync.getRange("B:B").format.columnWidthPx = 190;
sync.getRange("C:D").format.columnWidthPx = 220;
sync.getRange("E:E").format.columnWidthPx = 520;
sync.getRange("F:F").format.columnWidthPx = 310;
sync.getRange("G:G").format.columnWidthPx = 380;
sync.freezePanes.freezeRows(1);

await fsp.mkdir(outputDir, { recursive: true });
const inspectOverview = await workbook.inspect({ kind: "table", range: "Overview!A1:C33", include: "values,formulas", tableMaxRows: 35, tableMaxCols: 3, maxChars: 8000 });
const inspectChat = await workbook.inspect({ kind: "table", range: `Chat Messages!A1:O${Math.min(messageRows.length + 1, 8)}`, include: "values,formulas", tableMaxRows: 8, tableMaxCols: 15, tableMaxCellChars: 180, maxChars: 8000 });
const inspectEvents = await workbook.inspect({ kind: "table", range: "Task Events!A1:O8", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 15, tableMaxCellChars: 180, maxChars: 8000 });
const inspectErrors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan", maxChars: 4000 });

const previewRanges = {
  Overview: "A1:C33",
  "Chat Messages": `A1:O${Math.min(messageRows.length + 1, 12)}`,
  "Task Events": "A1:O16",
  "KB Linkage": `A1:D${kbRows.length + 1}`,
  "Sync Log": `A1:G${syncRows.length + 1}`,
};
const previewFiles = {};
for (const [sheetName, range] of Object.entries(previewRanges)) {
  const blob = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  const fileName = `${sheetName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  const filePath = path.join(outputDir, fileName);
  await fsp.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
  previewFiles[sheetName] = filePath;
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
const workbookBytes = await fsp.readFile(outputPath);
const workbookSha256 = sha256(workbookBytes);

console.log(JSON.stringify({
  outputPath,
  workbookBytes: workbookBytes.length,
  workbookSha256,
  source: { path: sourceLog, lines: sourceLines, bytes: sourceBytes, sha256: sourceSha256, maxOrdinal },
  messages: { total: messageRows.length, roles: roleCounts, userClasses: userClassCounts, manifestSha256: transcriptDigest },
  events: { total: events.length, distribution: Object.fromEntries([...counts.entries()].sort()) },
  previews: previewFiles,
  inspections: {
    overview: inspectOverview.ndjson,
    chat: inspectChat.ndjson,
    events: inspectEvents.ndjson,
    formulaErrors: inspectErrors.ndjson,
  },
}, null, 2));
