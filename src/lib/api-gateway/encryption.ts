/**
 * 顧客の upstream provider key を AES-256-GCM で暗号化保管。
 * Master key (32 bytes / hex 64 chars) は env API_KEY_ENCRYPTION_KEY で渡す。
 */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto";

const MASTER_KEY_HEX = process.env.API_KEY_ENCRYPTION_KEY;

function getKey(): Buffer {
  if (!MASTER_KEY_HEX || MASTER_KEY_HEX.length !== 64) {
    throw new Error(
      "API_KEY_ENCRYPTION_KEY env not set (32 bytes hex, 64 chars)"
    );
  }
  return Buffer.from(MASTER_KEY_HEX, "hex");
}

/**
 * 暗号化結果を 1 つの Buffer に詰めて返す（IV 12 + ciphertext + tag 16）
 * Postgres bytea にそのまま保存。
 */
export function encryptKey(plaintext: string): Buffer {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, tag]);
}

export function decryptKey(blob: Buffer): string {
  const key = getKey();
  const iv = blob.subarray(0, 12);
  const tag = blob.subarray(blob.length - 16);
  const ciphertext = blob.subarray(12, blob.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/** 表示用：先頭 8 + ... + 末尾 4 */
export function previewKey(key: string): string {
  if (key.length < 16) return key.slice(0, 4) + "..." + key.slice(-2);
  return key.slice(0, 8) + "..." + key.slice(-4);
}

/** Forge API key の SHA-256 ハッシュ（DB 検索用） */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/** 新しい Forge API key を発行（"forge_live_" + 32 文字 hex） */
export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const random = randomBytes(24).toString("base64url"); // ~32 chars URL-safe
  const key = `forge_live_${random}`;
  const prefix = key.slice(0, 19); // "forge_live_xxxxxxxx"
  const hash = hashApiKey(key);
  return { key, prefix, hash };
}
