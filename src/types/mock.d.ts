declare module 'vite-plugin-mock/es/createProdMockServer' {
  import { MockMethod } from 'vite-plugin-mock'
  export function createProdMockServer(mockList: MockMethod[]): void
} 