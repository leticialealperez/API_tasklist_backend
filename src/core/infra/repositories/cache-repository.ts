import { Redis } from "ioredis";
import { ITask } from "../../../features/tasklist/domain/models/task";
import { ICacheRepository } from "../../domain/model/cache-repository";
import { RedisConnection } from "../database/connections/redis";

export class CacheRepository implements ICacheRepository {
    private readonly redis: Redis;
    constructor() {
        this.redis = RedisConnection.getConnection();
    }

    async set(key: string, value: any): Promise<"OK"> {
        let result = await this.redis.setex(key, 5 * 60, JSON.stringify(value));
        if (result === null) throw new Error("Erro ao fazer o set no cache");
        return result;
    }

    async get(key: string): Promise<ITask[] | undefined> {
        let result = await this.redis.get(key);
        if (!result) return undefined;
        await this.redis.expire(key, 5 * 60); // renova o tempo de expiração mas faz com que o tempo médio de resposta vá de 150 pra 300 ms, não parece valer a pena
        return JSON.parse(result);
    }

    async flush(): Promise<"OK"> {
        return await this.redis.flushall();
    }
}
