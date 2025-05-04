export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
}

export function getMockUrls(): UrlData[] {
  // Current date for reference
  const now = new Date();

  // Helper to create dates relative to now
  const daysFromNow = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  return [
    {
      id: "1",
      originalUrl:
        "https://www.example.com/very/long/path/to/an/article/about/technology/and/its/impact/on/society",
      shortCode: "tech1",
      createdAt: daysAgo(15),
      expiresAt: daysFromNow(75),
      clicks: 1243,
    },
    {
      id: "2",
      originalUrl:
        "https://www.productlaunch.com/new-feature-announcement-2023",
      shortCode: "launch",
      createdAt: daysAgo(5),
      expiresAt: daysFromNow(25),
      clicks: 532,
    },
    {
      id: "3",
      originalUrl: "https://www.docs.example.org/api/reference/v2/endpoints",
      shortCode: "api-docs",
      createdAt: daysAgo(45),
      expiresAt: daysAgo(5),
      clicks: 2891,
    },
    {
      id: "4",
      originalUrl:
        "https://www.webinar-registration.com/upcoming/blockchain-basics",
      shortCode: "webinar",
      createdAt: daysAgo(2),
      expiresAt: daysFromNow(12),
      clicks: 89,
    },
    {
      id: "5",
      originalUrl:
        "https://www.example.com/blog/top-10-productivity-tips-for-remote-workers",
      shortCode: "remote",
      createdAt: daysAgo(60),
      expiresAt: daysAgo(10),
      clicks: 1567,
    },
    {
      id: "6",
      originalUrl: "https://www.conference.example.com/schedule/day-1",
      shortCode: "conf-d1",
      createdAt: daysAgo(10),
      expiresAt: daysFromNow(2),
      clicks: 423,
    },
    {
      id: "7",
      originalUrl:
        "https://www.example.org/resources/whitepaper-ai-trends-2023.pdf",
      shortCode: "ai-paper",
      createdAt: daysAgo(30),
      expiresAt: daysFromNow(150),
      clicks: 752,
    },
    {
      id: "8",
      originalUrl:
        "https://www.job-board.example.com/senior-developer-position",
      shortCode: "job-dev",
      createdAt: daysAgo(7),
      expiresAt: daysFromNow(23),
      clicks: 211,
    },
    {
      id: "9",
      originalUrl: "https://www.example.edu/courses/fall-2023/computer-science",
      shortCode: "cs-fall",
      createdAt: daysAgo(20),
      expiresAt: daysAgo(15),
      clicks: 189,
    },
    {
      id: "10",
      originalUrl: "https://www.product-demo.example.com/new-features",
      shortCode: "demo",
      createdAt: daysAgo(1),
      expiresAt: daysFromNow(29),
      clicks: 47,
    },
    {
      id: "11",
      originalUrl: "https://www.example.com/pricing/enterprise",
      shortCode: "pricing",
      createdAt: daysAgo(120),
      expiresAt: daysFromNow(245),
      clicks: 3254,
    },
    {
      id: "12",
      originalUrl: "https://www.newsletter.example.com/subscribe/tech-weekly",
      shortCode: "news",
      createdAt: daysAgo(25),
      expiresAt: daysFromNow(340),
      clicks: 876,
    },
    {
      id: "13",
      originalUrl:
        "https://www.example.org/events/annual-conference-2023/registration",
      shortCode: "event-reg",
      createdAt: daysAgo(18),
      expiresAt: daysAgo(2),
      clicks: 1432,
    },
    {
      id: "14",
      originalUrl: "https://www.example.com/support/ticket/submit",
      shortCode: "support",
      createdAt: daysAgo(40),
      expiresAt: daysFromNow(325),
      clicks: 321,
    },
    {
      id: "15",
      originalUrl:
        "https://www.research-paper.example.edu/quantum-computing-advances",
      shortCode: "quantum",
      createdAt: daysAgo(90),
      expiresAt: daysFromNow(275),
      clicks: 567,
    },
  ];
}
