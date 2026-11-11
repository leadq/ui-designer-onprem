export const getItemBinding = (value: string): string | null => {
  const candidate = value.replace(/^\{/, '').replace(/\}$/, '')

  return /^item(?:\.[A-Za-z_$][\w$]*)+$/.test(candidate) ? candidate : null
}
