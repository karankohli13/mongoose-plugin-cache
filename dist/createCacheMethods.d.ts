interface Context {
    enable: boolean;
    redis?: any;
    additionalCacheKeys?: string[];
    onCacheMiss?: Function;
    onDataMiss?: Function;
    model?: any;
}
declare const createCacheMethods: ({ enable, additionalCacheKeys, model, redis, onCacheMiss, onDataMiss, }: Context) => {
    withCachePrefix: (key: string) => string;
    onBatchCacheMiss: (keys: string[]) => void;
    onBatchDataMiss: (keys: string[]) => void;
    getManyBy: (queryKey: string, keys: string[]) => Promise<any[]>;
    getBy: (queryKey: string, key: string) => Promise<any>;
    cacheSet: (key: string, value: any) => Promise<void>;
    cacheSetMany: (entries: [string, any][]) => Promise<any>;
    cacheGet: (key: string) => Promise<any>;
    cacheGetBy: (cacheKey: string, key: string) => Promise<any>;
    cacheGetMany: (keys: string[]) => Promise<any[]>;
    cacheGetManyBy: (cacheKey: string, keys: string[]) => Promise<any[]>;
    cacheClear: (key: string) => Promise<void>;
    cacheClearMany: (keys: string[]) => Promise<void>;
};
export default createCacheMethods;
