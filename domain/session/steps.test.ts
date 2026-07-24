import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SessionStep } from "@prisma/client";
import {
  getStepLabelFr,
  resolveResumeTarget,
} from "./steps";

describe("resolveResumeTarget", () => {
  it("maps steps to client routes", () => {
    assert.equal(resolveResumeTarget(SessionStep.WELCOME), "/accueil");
    assert.equal(resolveResumeTarget(SessionStep.MENU), "/menu");
    assert.equal(resolveResumeTarget(SessionStep.ORDER), "/commande");
    assert.equal(resolveResumeTarget(SessionStep.END), "/fin");
  });

  it("exposes French labels for the soft banner", () => {
    assert.equal(getStepLabelFr(SessionStep.WELCOME), "Accueil");
    assert.equal(getStepLabelFr(SessionStep.MENU), "Menu");
    assert.equal(getStepLabelFr(SessionStep.ORDER), "Commande");
    assert.equal(getStepLabelFr(SessionStep.END), "Fin");
  });
});
