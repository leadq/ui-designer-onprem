const TURKISH_CHARACTER_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  Ç: 'C',
  Ğ: 'G',
  İ: 'I',
  Ö: 'O',
  Ş: 'S',
  Ü: 'U',
}

const getNormalizeWord = (word: string): string => {
  const normalizedTail = word === word.toUpperCase() ? word.slice(1).toLowerCase() : word.slice(1)

  return `${word.charAt(0).toUpperCase()}${normalizedTail}`
}

export const getPascalCase = (value: string): string => {
  const transliteratedValue = value.replace(
    /[çğıöşüÇĞİÖŞÜ]/g,
    (character) => TURKISH_CHARACTER_MAP[character] ?? character,
  )

  const identifier = transliteratedValue
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(getNormalizeWord)
    .join('')

  return /^\d/.test(identifier) ? `_${identifier}` : identifier
}
