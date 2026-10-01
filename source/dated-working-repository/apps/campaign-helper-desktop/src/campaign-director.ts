import { invoke } from "@tauri-apps/api/core";
import type { DirectorResponseEnvelope } from "@dicebox/director";

const CAMPAIGN_DIRECTOR_COMMAND = "request_campaign_director";
const MANAGED_CAMPAIGN_DIRECTOR_COMMAND = "request_campaign_director_managed";

export type CampaignDirectorCredentialStatus = Readonly<{
  operation: "dicebox.campaign-director.credential-status";
  status: "PASS";
  configured: boolean;
  source: "os-keyring" | "environment" | "none";
  secretsReturned: false;
  projectArtifactWrite: false;
}>;

export function isNativeCampaignDirectorAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function requestCampaignDirector(request: Readonly<Record<string, unknown>>): Promise<DirectorResponseEnvelope> {
  return invoke<DirectorResponseEnvelope>(CAMPAIGN_DIRECTOR_COMMAND, { request });
}

export type ManagedCampaignDirectorRequest = Readonly<{
  userIntent: string;
  document: Readonly<Record<string, unknown>>;
  knowledge: readonly Readonly<Record<string, unknown>>[];
}>;

export function requestManagedCampaignDirector(request: ManagedCampaignDirectorRequest): Promise<DirectorResponseEnvelope> {
  return invoke<DirectorResponseEnvelope>(MANAGED_CAMPAIGN_DIRECTOR_COMMAND, { request });
}

export function campaignDirectorCredentialStatus(): Promise<CampaignDirectorCredentialStatus> {
  return invoke<CampaignDirectorCredentialStatus>("campaign_director_credential_status");
}

export function storeCampaignDirectorApiKey(apiKey: string): Promise<CampaignDirectorCredentialStatus> {
  return invoke<CampaignDirectorCredentialStatus>("set_campaign_director_api_key", { apiKey });
}

export function removeCampaignDirectorApiKey(): Promise<CampaignDirectorCredentialStatus> {
  return invoke<CampaignDirectorCredentialStatus>("clear_campaign_director_api_key");
}
