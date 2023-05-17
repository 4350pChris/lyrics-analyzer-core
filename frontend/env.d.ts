/// <reference types="vite/client" />

import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

// extend import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}
