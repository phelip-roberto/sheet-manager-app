import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { cookies } from "next/headers"; // Use cookies for JWT in server components

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export default async function Home() {
  // Get token from cookies (Server Component Safe)
  const token = (await cookies()).get("token")?.value;
  const isAuthenticated = await verifyToken(token);

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
