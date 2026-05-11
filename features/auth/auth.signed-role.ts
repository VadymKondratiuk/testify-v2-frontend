import {
  SIGNED_ROLE_COOKIE_NAME,
  normalizeRole,
  type Role,
} from "@/features/auth/auth.rbac";

const SIGNATURE_ALGORITHM = "HMAC";
const HASH_ALGORITHM = "SHA-256";

function getSigningSecret() {
  return (
    process.env.AUTH_COOKIE_SECRET ??
    process.env.JWT_ACCESS_SECRET ??
    "testify-local-auth-cookie-secret"
  );
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSigningSecret()),
    { name: SIGNATURE_ALGORITHM, hash: HASH_ALGORITHM },
    false,
    ["sign", "verify"],
  );
}

async function signRole(role: Role) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    SIGNATURE_ALGORITHM,
    key,
    new TextEncoder().encode(role),
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSignedRoleValue(role: Role) {
  return `${role}.${await signRole(role)}`;
}

export async function verifySignedRoleValue(value: string | undefined) {
  if (!value) return null;

  const [rawRole, signature] = value.split(".");
  const role = normalizeRole(rawRole);
  if (!role || !signature) return null;

  const expectedSignature = await signRole(role);
  return signature === expectedSignature ? role : null;
}

export { SIGNED_ROLE_COOKIE_NAME };
