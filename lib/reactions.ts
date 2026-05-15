export const REACTIONS = [
  { key: "angry", emoji: "😡", label: "Angry" },
  { key: "clown", emoji: "🤡", label: "Clown" },
  { key: "disgust", emoji: "🤮", label: "Disgust" },
  { key: "cringe", emoji: "💀", label: "Cringe" },
  { key: "overrated", emoji: "🥱", label: "Overrated" },
] as const;

export type ReactionKey = (typeof REACTIONS)[number]["key"];

export const REACTION_KEYS = REACTIONS.map((r) => r.key) as readonly ReactionKey[];

export function isReactionKey(x: unknown): x is ReactionKey {
  return typeof x === "string" && (REACTION_KEYS as readonly string[]).includes(x);
}

export function reactionMeta(key: ReactionKey) {
  return REACTIONS.find((r) => r.key === key)!;
}
