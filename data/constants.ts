export type HeroStat = {
    key: string;
    label: string;
    value: number;
};

export const heroStats: HeroStat[] = [
    { key: 'creators', label: 'Creators Verified', value: 1240 },
    { key: 'campaigns', label: 'Campaigns Managed', value: 89 },
    { key: 'categories', label: 'Brand Categories', value: 32 },
];

export const searchPlaceholders = [
    'Search affiliated creators…',
    'Search your campaign creators…',
    'Search Sire Media verified creators…',
    'Search inside your campaign…',
    'Search creators assigned to your project…',
];

export const flowSteps = [
    {
        id: 'deliverables',
        title: 'Deliverables',
        detail: 'Shot lists, posting cadence, and approvals in one lane.',
        icon: '📦',
    },
    {
        id: 'approvals',
        title: 'Approvals',
        detail: 'Timed checkpoints with creator nudges and notes.',
        icon: '✅',
    },
    {
        id: 'timeline',
        title: 'Timelines',
        detail: 'Gantt-like view for reels, stories, and giveaways.',
        icon: '⏱️',
    },
];
