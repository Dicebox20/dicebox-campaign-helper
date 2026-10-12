#!/usr/bin/env node

/* Standard OIDC bearer verification for the public relay edge. */

import { createRemoteJWKSet, jwtVerify } from "jose";

function required(value, name) {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`${name} is required for OIDC verification.`);
  return normalized;
}

function scopesFromPayload(payload) {
  const values = [];
  if (typeof payload?.scope === "string") values.push(...payload.scope.split(/\s+/));
  if (Array.isArray(payload?.scp)) values.push(...payload.scp);
  return [...new Set(values.map(String).map(value => value.trim()).filter(Boolean))].slice(0, 32);
}

function safeAudience(value) {
  if (Array.isArray(value)) return value.map(String).slice(0, 8);
  return typeof value === "string" ? value : null;
}

function createOidcBearerVerifier({ issuer, audience, jwksUrl, jwtVerifyImpl = jwtVerify, createRemoteJWKSetImpl = createRemoteJWKSet } = {}) {
  const issuerValue = required(issuer, "OIDC issuer");
  const audienceValue = required(audience, "OIDC audience");
  const jwksUrlValue = required(jwksUrl, "OIDC JWKS URL");
  const jwks = createRemoteJWKSetImpl(new URL(jwksUrlValue));
  return async token => {
    if (typeof token !== "string" || !token.trim()) return null;
    try {
      const { payload } = await jwtVerifyImpl(token, jwks, { issuer: issuerValue, audience: audienceValue });
      const clientId = String(payload?.sub ?? payload?.azp ?? "oidc-client").trim();
      return {
        clientId: clientId.slice(0, 160) || "oidc-client",
        scopes: scopesFromPayload(payload),
        claims: Object.freeze({ issuer: String(payload?.iss ?? issuerValue), audience: safeAudience(payload?.aud), expiresAt: typeof payload?.exp === "number" ? payload.exp : null }),
      };
    } catch {
      return null;
    }
  };
}

export { createOidcBearerVerifier };
