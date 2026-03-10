#!/usr/bin/env node

/**
 * Generates an RSA key pair for PowerSync JWT authentication.
 *
 * Usage:
 *   node scripts/generate-keys.mjs
 *
 * Then set the output as Convex environment variables:
 *   pnpx convex env set POWERSYNC_JWT_PRIVATE_KEY <private_key_base64>
 *   pnpx convex env set POWERSYNC_JWT_PUBLIC_KEY <public_key_base64>
 */

import { exportJWK, generateKeyPair } from "jose";
import { randomBytes, randomUUID } from "crypto";

const alg = "RS256";
const kid = randomUUID();

const { publicKey, privateKey } = await generateKeyPair(alg);

const privateJwk = await exportJWK(privateKey);
privateJwk.alg = alg;
privateJwk.kid = kid;

const publicJwk = await exportJWK(publicKey);
publicJwk.alg = alg;
publicJwk.kid = kid;

const privateB64 = Buffer.from(JSON.stringify(privateJwk)).toString("base64");
const publicB64 = Buffer.from(JSON.stringify(publicJwk)).toString("base64");

const deployKey = randomBytes(32).toString("base64url");

console.log("=== PowerSync Keys Generated ===\n");
console.log("--- Deploy Key (for powersync.yaml api.tokens) ---\n");
console.log(deployKey);
console.log();
console.log("Add this to your powersync.yaml:");
console.log(`  api:`);
console.log(`    tokens:`);
console.log(`      - ${deployKey}`);
console.log();
console.log("And in cli.yaml:");
console.log(`  api_key: ${deployKey}`);
console.log();
console.log("--- JWT Keys (for Convex env vars) ---\n");
console.log("Set these as Convex environment variables:\n");
console.log(`pnpx convex env set POWERSYNC_JWT_PRIVATE_KEY "${privateB64}"\n`);
console.log(`pnpx convex env set POWERSYNC_JWT_PUBLIC_KEY "${publicB64}"\n`);
console.log("Also set these:");
console.log(`pnpx convex env set POWERSYNC_URL "http://localhost:8080"`);
console.log(`pnpx convex env set JWT_ISSUER "convex-powersync-demo"\n`);
console.log("Then configure your PowerSync service JWKS URL to:");
console.log("  http://127.0.0.1:3211/auth/keys");
