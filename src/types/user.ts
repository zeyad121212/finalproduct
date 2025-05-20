import { UserRole } from "@/lib/auth";

export interface User {
  id: string;
  code: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  department: string;
  avatar?: string;
}
