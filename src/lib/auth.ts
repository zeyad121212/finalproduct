import { createClient } from "@supabase/supabase-js";
import { type User } from "@/types/user";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// User roles
export type UserRole = "DV" | "CC" | "PM" | "SV" | "TR" | "MB";

// Authentication functions
export async function loginWithCode(
  code: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    // First check if the code exists in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("code", code)
      .single();

    if (userError || !userData) {
      return { user: null, error: "Invalid credentials. Please try again." };
    }

    // Then authenticate with Supabase using email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "Authentication failed" };
    }

    // Return the user with role and other details
    return {
      user: {
        id: data.user.id,
        code: userData.code,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        region: userData.region,
        department: userData.department,
        avatar: userData.avatar,
      },
      error: null,
    };
  } catch (err) {
    console.error("Login error:", err);
    return { user: null, error: "An unexpected error occurred" };
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  // Get the user details from our users table
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!userData) return null;

  return {
    id: data.user.id,
    code: userData.code,
    name: userData.name,
    email: userData.email,
    role: userData.role as UserRole,
    region: userData.region,
    department: userData.department,
    avatar: userData.avatar,
  };
}

export function useAuth() {
  // This is a simplified version - in a real app, you'd use React context
  return {
    loginWithCode,
    logout,
    getCurrentUser,
  };
}
