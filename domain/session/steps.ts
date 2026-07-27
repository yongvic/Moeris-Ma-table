import { SessionStep } from "@prisma/client";

export type StepRoute = {
  step: SessionStep;
  labelFr: string;
  href: string;
};

/** Ordered séjour steps — Service is intentionally excluded (lateral path). */
export const SEJOUR_STEPS: readonly SessionStep[] = [
  SessionStep.WELCOME,
  SessionStep.MENU,
  SessionStep.ORDER,
  SessionStep.END,
] as const;

export const SEJOUR_STEP_TOTAL = SEJOUR_STEPS.length;

const STEP_ROUTES: Record<SessionStep, StepRoute> = {
  WELCOME: { step: SessionStep.WELCOME, labelFr: "Accueil", href: "/accueil" },
  MENU: { step: SessionStep.MENU, labelFr: "Menu", href: "/menu" },
  ORDER: { step: SessionStep.ORDER, labelFr: "Commande", href: "/mes-commandes" },
  END: { step: SessionStep.END, labelFr: "Fin", href: "/fin" },
};

export function getStepRoute(step: SessionStep): StepRoute {
  return STEP_ROUTES[step] ?? STEP_ROUTES.WELCOME;
}

/** Resolve restore target from Neon Session.step (AD-5). Service is not a step. */
export function resolveResumeTarget(step: SessionStep): string {
  return getStepRoute(step).href;
}

export function getStepLabelFr(step: SessionStep): string {
  return getStepRoute(step).labelFr;
}

/** 1-based index for progress (WELCOME=1 … END=4). */
export function getSejourStepIndex(step: SessionStep): number {
  const idx = SEJOUR_STEPS.indexOf(step);
  return idx >= 0 ? idx + 1 : 1;
}

export function getSejourProgressAria(step: SessionStep): string {
  const n = getSejourStepIndex(step);
  const label = getStepLabelFr(step);
  return `Étape ${n} sur ${SEJOUR_STEP_TOTAL} : ${label}`;
}
