/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MSW: string;
  readonly VITE_BASENAME: string;
  readonly VITE_REVISION: string;
  readonly VITE_BUILT_AT: string;
}
