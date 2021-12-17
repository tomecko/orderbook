// type util for extra clarity and type safety
// see https://michalzalecki.com/nominal-typing-in-typescript/ for motivation and explanation
export type Brand<T, K> = T & { __brand: K };
