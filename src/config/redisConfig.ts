import { createClient } from 'redis';

const RedisClient = createClient(process.env.REDIS_URL as string);

RedisClient.on('connect', () => {
    console.log('Redis Client is on');
});

RedisClient.on('ready', () => {
    console.log('Redis client is ready');
});

RedisClient.on('error', (err) => {
    console.log(err);
});

RedisClient.on('end', () => {
    console.log('Client has disconnected');
});

process.on('SIGINT', () => {
    RedisClient.quit();
});

export const redisSetAsync = (
    key: string,
    token: string,
    duration?: number,
) => {
    if (duration) {
        return new Promise<void>((resolve, reject) => {
            RedisClient.SET(key, token, 'EX', duration, (err, reply) => {
                if (err) {
                    console.log(err.message);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    return new Promise<void>((resolve, reject) => {
        RedisClient.SET(key, token, (err, reply) => {
            if (err) {
                console.log(err.message);
                reject(err);
                return;
            }
            resolve();
        });
    });
};

export const redisGetAsync = (key: string) => {
    return new Promise<string>((resolve, reject) => {
        RedisClient.GET(key, (err, reply) => {
            if (err) {
                console.log(err.message);
                reject(err);
                return;
            }
            resolve(reply as string);
        });
    });
};

export const redisDelAsync = (key: string) => {
    return new Promise<void>((resolve, reject) => {
        RedisClient.DEL(key, (err, reply) => {
            if (err) {
                console.log(err.message);
                reject(err);
                return;
            }
            resolve();
        });
    });
};

export default RedisClient;
