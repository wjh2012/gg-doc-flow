import { UserProfile } from './database.user.types';

export type UserRole = 'user' | 'admin';

export { type UserProfile };

/**
 * 도메인/API용 User 엔티티 (password 제외)
 * 서비스 간 통신, API 응답에서 사용
 */
export interface UserEntity {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  profile: UserProfile;
  created_at: Date;
  updated_at: Date;
}

/**
 * 인증이 필요한 내부 서비스 통신용 (password 포함)
 */
export interface UserWithPassword extends UserEntity {
  password: string;
}

/**
 * 사용자 생성 요청 DTO
 */
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profile: UserProfile;
}

/**
 * 사용자 수정 요청 DTO
 */
export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  profile?: UserProfile;
}

/**
 * JWT 토큰 페이로드
 */
export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

/**
 * 인증 응답
 */
export interface AuthResponse {
  access_token: string;
}
