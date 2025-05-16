import { signOut } from "next-auth/react";

export async function doLogout() {
  await signOut({}).then(() => {
    console.log("✅ Logged out");
  });
}
