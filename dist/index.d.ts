interface Context {
    enable: boolean;
    redis?: any;
    additionalCacheKeys?: string[];
    onCacheMiss?: Function;
    onDataMiss?: Function;
}
declare const createCachePlugin: ({ redis, enable, additionalCacheKeys, onCacheMiss, }: Context) => (schema: any) => void;
export default createCachePlugin;
