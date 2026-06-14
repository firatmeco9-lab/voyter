export const firstWords = [
  "Asabi",
  "Uykusuz",
  "Turbo",
  "Şüpheli",
  "Kaotik",
  "Yorgun",
  "Sessiz",
  "Kızgın",
  "Dertli",
  "Gececi",
];

export const secondWords = [
  "Kebap",
  "Karınca",
  "Mandalina",
  "Penguen",
  "Tost",
  "Piksel",
  "Lahmacun",
  "Karpuz",
  "Kedi",
  "Mühendis",
];

export function createAnonymousName() {
  const first =
    firstWords[Math.floor(Math.random() * firstWords.length)];

  const second =
    secondWords[Math.floor(Math.random() * secondWords.length)];

  const number = Math.floor(Math.random() * 90) + 10;

  return `${first}${second}${number}`;
}