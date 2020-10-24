export interface MissionItem {
  label: string;
  content: string;
}

export enum LoggedInStatus {
  LoggedIn,
  GuestSession,
  NoToken,
}

export interface CreatedLink {
  short_link: string;
  long_link: string;
}
