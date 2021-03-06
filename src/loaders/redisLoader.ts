import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createClient, RedisClient } from 'redis';
import { Container } from 'typedi';

import { env } from '../env';
import { Logger } from '../lib/logger';

const log = new Logger(__filename);

function createConnection(): Promise<RedisClient> {
  return new Promise((resolve, reject) => {
    const client = createClient(env.redis.port, env.redis.host);
    client.on('connect', () => {
      log.debug('Cache set up on redis instance');
      return resolve(client);
    });
    client.on('error', err => {
      log.error(`Error connect to redis instance ${err}`);
      return reject(err);
    });
  });
}

export const redisLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  log.debug('Loading redis started');
  log.getWinston().profile('loading redis');
  const redisClient = await createConnection();
  Container.set('redisClient', redisClient);
  settings.setData('redisClient', redisClient);
  log.getWinston().profile('loading redis');
};
