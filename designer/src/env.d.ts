declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>

  export default classes
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>

  export default classes
}

declare module '*.svg' {
  const url: string

  export default url
}

declare module '*.png' {
  const url: string

  export default url
}

declare module '*.jpg' {
  const url: string

  export default url
}

declare module '*.webp' {
  const url: string

  export default url
}
