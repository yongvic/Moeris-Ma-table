export type MerciTone = "super" | "correct" | "mitige";

export type MerciCopy = {
  tone: MerciTone;
  title: string;
  body: string;
};

/** Mapping note → ton (story 4.3). */
export function toneFromStars(stars: number): MerciTone {
  if (stars >= 4) return "super";
  if (stars === 3) return "correct";
  return "mitige";
}

export function merciCopyFromStars(stars: number): MerciCopy {
  const tone = toneFromStars(stars);
  switch (tone) {
    case "super":
      return {
        tone,
        title: "Merci du fond du cœur !",
        body: "Ta note nous fait plaisir — l’équipe Moeris a adoré t’accueillir.",
      };
    case "correct":
      return {
        tone,
        title: "Merci pour ton retour",
        body: "On note, et on continue à soigner chaque soirée à la Résidence.",
      };
    case "mitige":
      return {
        tone,
        title: "Merci d’avoir partagé",
        body: "Ton avis compte — on s’en sert pour faire encore mieux la prochaine fois.",
      };
  }
}
