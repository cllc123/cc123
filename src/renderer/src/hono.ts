import * as hono_hono_base from 'hono/hono-base';
import * as hono_utils_http_status from 'hono/utils/http-status';
import * as hono from 'hono';
import * as hono_types from 'hono/types';

declare const routes: hono_hono_base.HonoBase<hono_types.BlankEnv, {
    "/wallets/transactions/tip": {
        $post: {
            input: {
                json: {
                    userId: string;
                    amount: string;
                    entryId?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/wallets": {
        $get: {
            input: {
                query: {
                    userId?: string | undefined;
                    address?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    userId: string;
                    addressIndex: number;
                    address: string | null;
                    createdAt: string;
                    powerToken: bigint;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    userId: string;
                    addressIndex: number;
                    address: string | null;
                    createdAt: string;
                    powerToken: bigint;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/ai/translation": {
        $get: {
            input: {
                query: {
                    id: string;
                    language: "en" | "ja" | "zh-CN" | "zh-TW";
                    fields: string;
                };
            };
            output: {
                code: 0;
                data?: {
                    description?: string | undefined;
                    title?: string | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/ai/summary": {
        $get: {
            input: {
                query: {
                    id: string;
                    language?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                };
            };
            output: {
                code: 0;
                data?: string | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/actions": {
        $get: {
            input: {};
            output: {
                code: 0;
                data?: {
                    userId: string;
                    rules?: {
                        name: string;
                        condition: {
                            value: string;
                            field: "title" | "site_url" | "view" | "feed_url";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                        result: {
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            summary?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "url" | "author" | "all" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                        };
                    }[] | null | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $put: {
            input: {
                json: {
                    rules?: {
                        name: string;
                        condition: {
                            value: string;
                            field: "title" | "site_url" | "view" | "feed_url";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                        result: {
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            summary?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "url" | "author" | "all" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                        };
                    }[] | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/reads": {
        $post: {
            input: {
                json: {
                    entryIds: string[];
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    entryId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: Record<string, number>;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/reads/all": {
        $post: {
            input: {
                json: {
                    feedId?: string | undefined;
                    view?: number | undefined;
                    feedIdList?: string[] | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/collections": {
        $get: {
            input: {
                query: {
                    entryId: string;
                };
            };
            output: {
                code: 0;
                data: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    entryId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    entryId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/categories": {
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                data?: string[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    feedIdList: string[];
                    deleteSubscriptions: boolean;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $patch: {
            input: {
                json: {
                    category: string;
                    feedIdList: string[];
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/feeds/claim/message": {
        $get: {
            input: {
                query: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    xml: string;
                    description: string;
                    content: string;
                    json: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/feeds/claim/challenge": {
        $post: {
            input: {
                json: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/feeds": {
        $get: {
            input: {
                query: {
                    id?: string | undefined;
                    url?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    feed: {
                        url: string;
                        checkedAt: string;
                        nextCheckAt: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        id?: string | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        lastModifiedHeader?: string | null | undefined;
                        etagHeader?: string | null | undefined;
                        ttl?: number | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                    };
                    subscriptionCount: number;
                    readCount: number;
                    subscription?: {
                        title: string | null;
                        userId: string;
                        feedId: string;
                        view: number;
                        category: string | null;
                        isPrivate: boolean | null;
                    } | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/feeds/refresh": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/discover": {
        $post: {
            input: {
                json: {
                    keyword: string;
                    type?: "auto" | "rss" | undefined;
                };
            };
            output: {
                data: {
                    feed: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                        ownerUserId: string | null;
                    };
                    entries?: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        url: string | null;
                        feedId: string;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            length?: number | undefined;
                            type?: string | undefined;
                            title?: string | undefined;
                        }[] | null | undefined;
                    }[] | undefined;
                    docs?: string | undefined;
                    isSubscribed?: boolean | undefined;
                    subscriptionCount?: number | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/auth-app/new-session": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    userId: string;
                    sessionToken: string;
                    expires: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/auth-app/update-account": {
        $patch: {
            input: {
                json: {
                    name?: string | null | undefined;
                    image?: string | null | undefined;
                    handle?: string | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    [x: `/import/${string}`]: {
        [x: `$${Lowercase<string>}`]: {
            input: Partial<hono.ValidationTargets>;
            output: any;
            outputFormat: string;
            status: hono_utils_http_status.StatusCode;
        };
    };
} & {
    "/entries": {
        $post: {
            input: {
                json: {
                    feedId?: string | undefined;
                    view?: number | undefined;
                    read?: boolean | undefined;
                    limit?: number | undefined;
                    feedIdList?: string[] | undefined;
                    publishedAfter?: string | undefined;
                    collected?: boolean | undefined;
                };
            };
            output: {
                code: 0;
                total: number;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        url: string | null;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            length?: number | undefined;
                            type?: string | undefined;
                            title?: string | undefined;
                        }[] | null | undefined;
                    };
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                        ownerUserId: string | null;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        summary?: boolean | undefined;
                        rewriteRules?: {
                            from: string;
                            to: string;
                        }[] | undefined;
                    } | undefined;
                }[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        url: string | null;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            length?: number | undefined;
                            type?: string | undefined;
                            title?: string | undefined;
                        }[] | null | undefined;
                    };
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                        ownerUserId: string | null;
                    };
                    collections: {
                        createdAt: string;
                    };
                    read: boolean | null;
                    settings?: {
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        summary?: boolean | undefined;
                        rewriteRules?: {
                            from: string;
                            to: string;
                        }[] | undefined;
                    } | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/entries/preview": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data: {
                    description: string | null;
                    title: string | null;
                    content: string | null;
                    id: string;
                    url: string | null;
                    feedId: string;
                    guid: string;
                    author: string | null;
                    authorUrl: string | null;
                    authorAvatar: string | null;
                    changedAt: string;
                    publishedAt: string;
                    images: string[] | null;
                    categories: string[] | null;
                    enclosures?: {
                        url: string;
                        length?: number | undefined;
                        type?: string | undefined;
                        title?: string | undefined;
                    }[] | null | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/subscriptions": {
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    title: string | null;
                    userId: string;
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                        ownerUserId: string | null;
                    };
                    feedId: string;
                    view: number;
                    category: string | null;
                    isPrivate: boolean | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    url: string;
                    view: number;
                    category?: string | null | undefined;
                    isPrivate?: boolean | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    url?: string | undefined;
                    feedId?: string | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $patch: {
            input: {
                json: {
                    feedId: string;
                    view: number;
                    category?: string | null | undefined;
                    isPrivate?: boolean | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
type AppType = typeof routes;

export type { AppType };
