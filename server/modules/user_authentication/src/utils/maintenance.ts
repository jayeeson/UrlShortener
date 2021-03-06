import { clearExpiredTokensFromBlacklist } from '../helpers/sql/blacklist';

const msToMinutes = 1000 * 60;

export const clearBlacklistOnInterval = (minutes: number): void => {
  setInterval(async () => {
    await clearExpiredTokensFromBlacklist();
  }, minutes * msToMinutes);
};
