export const detectSentiment = (text) => {

  if (!text) return "neutral";

  const lower = text.toLowerCase();

  // 😊 HAPPY
  const happyWords = [
    "happy",
    "excited",
    "great",
    "awesome",
    "good",
    "amazing",
    "yay",
    "fun",
    "nice",
    "cool",
    "fantastic",
    "best",
    "enjoy",
    "smile",
    "wonderful",
    "perfect",
    "beautiful",
    "proud",
    "party",
    "celebrate",
  ];

  // 😡 ANGRY
  const angryWords = [
    "hate",
    "angry",
    "worst",
    "mad",
    "annoyed",
    "irritated",
    "frustrated",
    "stupid",
    "idiot",
    "ugly",
    "disgusting",
    "toxic",
    "sucks",
    "nonsense",
    "furious",
    "rage",
  ];

  // 😢 SAD
  const sadWords = [
    "sad",
    "cry",
    "upset",
    "lonely",
    "depressed",
    "hurt",
    "broken",
    "miss",
    "pain",
    "heartbroken",
    "tired",
    "stress",
    "stressed",
    "hopeless",
    "lost",
    "bad day",
    "unhappy",
  ];

  // 💜 ROMANTIC
  const romanticWords = [
    "love",
    "miss you",
    "baby",
    "sweetheart",
    "kiss",
    "darling",
    "cute",
    "mine",
    "bae",
    "beautiful girl",
    "handsome",
    "hug",
    "forever",
    "soulmate",
    "wife",
    "husband",
    "romantic",
    "date",
  ];


  // 💜 Romantic gets highest priority
  if (
    romanticWords.some((word) =>
      lower.includes(word)
    )
  ) {
    return "romantic";
  }

  // 😊 Happy
  if (
    happyWords.some((word) =>
      lower.includes(word)
    )
  ) {
    return "happy";
  }

  // 😡 Angry
  if (
    angryWords.some((word) =>
      lower.includes(word)
    )
  ) {
    return "angry";
  }

  // 😢 Sad
  if (
    sadWords.some((word) =>
      lower.includes(word)
    )
  ) {
    return "sad";
  }

  // 😐 Neutral
  return "neutral";

};