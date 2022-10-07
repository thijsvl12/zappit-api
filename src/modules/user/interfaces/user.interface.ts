import { User } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaswordlessUser extends Omit<User, 'password'> {}
