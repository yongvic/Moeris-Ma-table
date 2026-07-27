import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SessionStep } from "@prisma/client";
import {
  getSejourProgressAria,
  getSejourStepIndex,
  getStepLabelFr,
  resolveResumeTarget,
} from "./steps";

describe("resolveResumeTarget", () => {
  it("maps steps to client routes", () => {
    assert.equal(resolveResumeTarget(SessionStep.WELCOME), "/accueil");
    assert.equal(resolveResumeTarget(SessionStep.MENU), "/menu");
    assert.equal(resolveResumeTarget(SessionStep.ORDER), "/mes-commandes");
    assert.equal(resolveResumeTarget(SessionStep.END), "/fin");
  });

  it("exposes French labels for the soft banner", () => {
    assert.equal(getStepLabelFr(SessionStep.WELCOME), "Accueil");
    assert.equal(getStepLabelFr(SessionStep.MENU), "Menu");
    assert.equal(getStepLabelFr(SessionStep.ORDER), "Commande");
    assert.equal(getStepLabelFr(SessionStep.END), "Fin");
  });

  it("maps step to 1-based progress index and aria name", () => {
    assert.equal(getSejourStepIndex(SessionStep.WELCOME), 1);
    assert.equal(getSejourStepIndex(SessionStep.MENU), 2);
    assert.equal(getSejourStepIndex(SessionStep.ORDER), 3);
    assert.equal(getSejourStepIndex(SessionStep.END), 4);
    assert.equal(
      getSejourProgressAria(SessionStep.MENU),
      "Étape 2 sur 4 : Menu",
    );
  });
});
