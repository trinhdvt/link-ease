export type Url = {
  id: string;
  original: string;
  expiresAt: number;
  ownerId?: string;
  createdAt?: number;
  dailyAccessCounts?: Record<string, number>;
  accessLogs?: Array<AccessLog>;
};

export type AccessLog = {
  timestamp: number;
  date: string;
  userAgent: string;
  referrer: string;
};
