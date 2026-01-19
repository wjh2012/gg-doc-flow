import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface UserProfile {
  avatar_url: string | null;
  bio: string | null;
}

export interface UserTable {
  id: Generated<number>;

  email: string;
  password: string;
  name: string;

  role: 'user' | 'admin';

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;

  profile: ColumnType<UserProfile, UserProfile, UserProfile>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
