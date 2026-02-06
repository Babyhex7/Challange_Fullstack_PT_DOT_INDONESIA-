// Konfigurasi JWT (secret key & expiration)
export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'super_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
});
