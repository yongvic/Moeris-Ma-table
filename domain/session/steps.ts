import { SessionStep } from "@prisma/client";

export type StepRoute = {
  step: SessionStep;
  labelFr: string;
  href: string;
};

const STEP_ROUTES: Record<SessionStep, StepRoute> = {
  WELCOME: { step: SessionStep.WELCOME, labelFr: "Accueil", href: "/accueil" },
  MENU: { step: SessionStep.MENU, labelFr: "Menu", href: "/menu" },
  ORDER: { step: SessionStep.ORDER, labelFr: "Commande", href: "/commande" },
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
