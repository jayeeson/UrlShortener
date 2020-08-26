import { clearExpiredTokensFromBlacklist } from '../helpers/sql/blacklist';

const msToMinutes = 1000 * 60;

export const clearBlacklistOnInterval = (minutes: number) => {
  setInterval(() => {
    clearExpiredTokensFromBlacklist();
  }, msToMinutes * minutes);
};
