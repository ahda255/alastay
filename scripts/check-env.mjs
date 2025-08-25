// scripts/check-env.mjs
const required = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "JWT_SECRET"
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌ Missing env:", missing.join(", "));
  process.exit(1);
} else {
  console.log("✅ All required env present.");
}
