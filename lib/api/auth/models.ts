interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
  };
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export type { RegisterRequest, RegisterResponse, VerifyOtpRequest, VerifyOtpResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse };