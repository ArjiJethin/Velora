export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: import('@prisma/client').UserRole;
      status: import('@prisma/client').UserStatus;
      avatar: string | null;
      bio: string | null;
      emailVerified: boolean;
    }
  }
}