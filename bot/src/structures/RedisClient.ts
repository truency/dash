import { logger, Logger, ListenerUtil } from 'yamdbf';
import { Client as Cache } from '@spectacles/cache';
import { EventEmitter } from 'events';
import * as Redis from 'ioredis';
import { Guild, UnavailableGuild } from '@spectacles/types';

const { on, once } = ListenerUtil;

export class RedisClient extends EventEmitter {

    private redis: Redis.Redis = new Redis(process.env.REDIS);
    private redisSender: Redis.Redis = new Redis(process.env.REDIS);
    public cache: Cache;
    @logger public readonly logger: Logger;

    public constructor() {
        super();

        ListenerUtil.registerListeners(this.redis, this);
        this.cache = new Cache(this.redis);
        this.redis.psubscribe('web.*', 'bot.*');
        this.redisSender.on('ready', (): Promise<void> => this.logger.log('redis', 'Redis sender ready!'));
    }

    /**
     * Redis Client Getter
     * @returns {Redis.Redis} redis client
     */
    public get redisClient(): Redis.Redis {
        return this.redis;
    }

    /**
     * OnReady event for Redis Reciever Client
     * @returns {void}
     * @private
     */
    @on('ready')
    private onReady(): void {
        this.logger.log('redis', 'Redis reciever ready!');
    }

    /**
     * Message handler for Redis reciever client.
     * @param {string} pattern Pattern
     * @param {string} channel Channel
     * @param {any} payload Payload
     * @returns {void}
     */
    @on('pmessage')
    private onMessage(pattern: string, channel: string, payload: any): void {
        try {
            this.emit(pattern, channel, payload);
        } catch (e) {
            this.onError(e);
        }
    }

    /**
     * Publish to redis channel the bot is registed to.
     * Example usage:
     * ``<RedisClient>.publish('channel.name', 'message');``
     * @param {string} channel Channel name
     * @param {string} message Message
     * @returns {Promise<void>}
     */
    public async publish(channel: string, message: string): Promise<void> {
        await this.redisSender.publish(channel, message);
        this.logger.log('Redis', `Published ${message} to ${channel}.`);
    }

    /**
     * @deprecated This method is deprecated due to an old version of ``spec-tacles/cache``.
     * Save guild to cache
     * @param {Guild} guild Guild object
     * @returns {void}
     */
    public async saveGuild(guild: Guild): Promise<void> {
        try {
            await this.cache.actions.guilds.upsert(guild);
            this.logger.log('redis', 'Guild saved to cache.');
        } catch (e) {
            this.logger.log('redis', `Couldn't save guild: ${e.message}`);
        }
    }

    /**
     * Error handler for redis
     * @param {Error} e Error
     * @returns {void}
     */
    @on('error')
    private onError(e: Error): void {
        this.logger.log('redis', e.toString());
    }
}
