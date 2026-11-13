/**
 * DCH M0 browser-console observation for the disposable v3 Foundry game.
 * Run manually only INSIDE an already-authenticated Foundry game client.
 * It does not authenticate a user, install a module, call a bridge, or mutate game.
 * Its result is CLIENT-SELF-OBSERVATION, NOT independent host authentication.
 */
(() => {
  const operation = "dch.m0.disposable-v3.browser-gm-self-observation";
  const worldId = "dbx-test-world";
  const moduleId = "dicebox-campaign-helper";
  const blocked = (reason) => ({
    schemaVersion: "1.0.0",
    operation,
    status: "BLOCKED",
    evidenceClass: "browser-client-self-observation",
    expectedWorldId: worldId,
    reason,
    noFoundryWrite: true,
    networkRequests: 0,
    independentlyAuthenticatedHostCaller: false,
    authenticatedChatGptCaller: false,
    loadedModuleByteHashVerified: false,
    m0Acceptance: "NOT_ACCEPTED",
  });
  let observation;
  try {
    const currentGame = globalThis.game;
    const world = currentGame?.world;
    const user = currentGame?.user;
    const elected = currentGame?.users?.activeGM;
    const installedModule = currentGame?.modules?.get?.(moduleId);
    if (currentGame?.ready !== true || currentGame?.view !== "game") {
      observation = blocked("AUTHENTICATED_GAME_VIEW_NOT_READY");
    } else if (world?.id !== worldId) {
      observation = blocked("EXACT_DISPOSABLE_WORLD_NOT_OBSERVED");
    } else if (currentGame?.system?.id !== "dnd5e" ||
      currentGame?.system?.version !== "5.3.3" ||
      !/^14\./.test(String(currentGame?.version ?? ""))) {
      observation = blocked("PINNED_FOUNDRY_SYSTEM_NOT_OBSERVED");
    } else if (!user?.id || typeof user?.name !== "string" || !user.name.trim() || user?.isSelf !== true || user?.isGM !== true ||
      user?.isActiveGM !== true || user?.role !== 4 || user?.active !== true) {
      observation = blocked("CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM");
    } else if (!elected?.id || typeof elected?.name !== "string" || !elected.name.trim() || elected.id !== user.id ||
      elected?.role !== 4 || elected?.isGM !== true) {
      observation = blocked("ELECTED_ACTIVE_GM_MISMATCH");
    } else if (!installedModule || installedModule.id !== moduleId ||
      installedModule.active !== true || installedModule.version !== "0.1.15") {
      observation = blocked("DCH_MODULE_VERSION_OR_ACTIVE_STATUS_UNVERIFIED");
    } else {
      const users = currentGame?.users?.contents;
      if (!Array.isArray(users) || users.length < 1 || users.length > 50 ||
        users.some((item) => typeof item?.id !== "string" || !item.id ||
          typeof item?.name !== "string" || !item.name ||
          !Number.isInteger(item?.role) || item.role < 0 || item.role > 4) ||
        !users.some((item) => item.id === user.id && item.role === 4)) {
        observation = blocked("AUTHORITATIVE_USER_COLLECTION_NOT_READABLE");
      } else {
        observation = {
          schemaVersion: "1.0.0",
          operation,
          status: "OBSERVED_CLIENT_ONLY",
          evidenceClass: "browser-client-self-observation",
          observedAtUtc: new Date().toISOString(),
          target: {
            exactWorldId: world.id,
            foundryVersion: String(currentGame.version),
            systemId: currentGame.system.id,
            systemVersion: currentGame.system.version,
          },
          currentUser: {
            id: user.id, name: user.name, role: user.role,
            isGM: user.isGM, isSelf: user.isSelf,
            isActiveGM: user.isActiveGM, active: user.active,
          },
          electedActiveGm: {
            id: elected.id, name: elected.name, role: elected.role,
            sameAsCurrentUser: elected.id === user.id,
          },
          existingUsers: users.map((item) => ({
            id: item.id, name: item.name, role: item.role,
          })),
          dchModule: {
            id: installedModule.id, version: installedModule.version,
            active: installedModule.active,
          },
          noFoundryWrite: true,
          networkRequests: 0,
          independentlyAuthenticatedHostCaller: false,
          authenticatedChatGptCaller: false,
          loadedModuleByteHashVerified: false,
          m0Acceptance: "NOT_ACCEPTED",
          remainingBlockers: [
            "This is an observation from the local browser client, not an independently authenticated host or ChatGPT session.",
            "Module active does not prove loaded JS byte identity or a DCH desktop-to-module roundtrip.",
          ],
        };
      }
    }
  } catch {
    observation = blocked("LIVE_CLIENT_OBSERVATION_UNAVAILABLE");
  }
  // Console output is local to this owner-controlled Foundry browser tab.
  console.info("DCH M0 browser observation:", JSON.stringify(observation));
  return observation;
})()
