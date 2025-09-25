// @node-rs/bcrypt：
import { hash as _hash, compare as _compare } from "@node-rs/bcrypt";

const ROUNDS = 12;

/**
 * 
 * @param plain 
 * @returns 
 */
export async function hashPassword(plain: string) {
  return _hash(plain, ROUNDS); // @node-rs/bcrypt
}

/**
 * 
 * @param plain 
 * @param hashed 
 * @returns 
 */
export async function verifyPassword(plain: string, hashed: string) {
  return _compare(plain, hashed); // @node-rs/bcrypt
}
