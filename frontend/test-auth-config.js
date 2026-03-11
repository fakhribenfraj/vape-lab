// Test script to verify Better Auth configuration
console.log("Testing auth configuration...");

// Check if required environment variables are set
const requiredEnvVars = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
];

console.log("\n=== Environment Variables Check ===");
requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(
      `✅ ${envVar}: ${envVar.includes("URL") ? "SET" : value.substring(0, 10) + "..."}`,
    );
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
  }
});

// Check if auth files exist
const fs = require("fs");
console.log("\n=== File Existence Check ===");
const authFiles = [
  "src/lib/auth/index.ts",
  "src/lib/auth/client.ts",
  "src/app/api/auth/[...all]/route.ts",
  "src/hooks/use-auth.ts",
];

authFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}: exists`);
  } else {
    console.log(`❌ ${file}: missing`);
  }
});

console.log("\n=== Test Complete ===");
