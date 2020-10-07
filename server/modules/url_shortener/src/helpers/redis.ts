import config from '../utils/config';

export function deleteUserAuthenticatorsList(): void {
  const uei = process.env.UEI;
  if (!uei) {
    return;
  }

  config.redis.client.DEL(`urlshortener:${uei}:userauthenticators`);
}
