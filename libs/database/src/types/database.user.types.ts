import {
  Generated,
  ColumnType,
  JSONColumnType,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';

export interface UserTable {
  id: Generated<number>;

  email: string;
  name: string;

  role: 'user' | 'admin';

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;

  profile: JSONColumnType<{
    avatar_url: string | null;
    bio: string | null;
  }>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
