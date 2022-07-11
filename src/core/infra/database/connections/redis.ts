import redis, { Redis } from 'ioredis';

export class RedisConnection {
  private static _connection: Redis;

  static async initConnection(): Promise<void> {
    if (!this._connection)
      this._connection = new redis(process.env.REDISCLOUD_URL);
  }

  static getConnection(): Redis {
    if (this._connection) {
      return this._connection;
    } else {
      throw new Error(
        'Erro ao tentar estabalecer conexão com o REDIS, tente novamente mais tarde.'
      );
    }
  }
  static async closeConnection(): Promise<void> {
    if (this._connection) {
      await this._connection.quit();
    }
  }
}
