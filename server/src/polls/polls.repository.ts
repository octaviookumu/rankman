import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IORedisKey } from '../redis/redis.module';
import {
  AddNominationData,
  AddParticipantData,
  AddParticipantRankingsData,
  CreatePollData,
} from './types';
import { Poll, Results } from '../polls/types/poll-types';

@Injectable()
export class PollsRepository {
  // to user time-to-live from configuration
  // stores how long the poll should exist based on env
  private readonly ttl: string;
  private logger = new Logger(PollsRepository.name);

  constructor(
    private configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll: Poll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      adminID: userID,
      hasStarted: false,
      nominations: {},
      rankings: {},
      results: [],
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      this.logger.log(`Run try`);
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      this.logger.log(`Finish Running try`);
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException(
        `Failed to add poll ${JSON.stringify(initialPoll)}`,
      );
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.call('JSON.GET', key, '.');

      this.logger.verbose(currentPoll);

      if (typeof currentPoll !== 'string') {
        throw new Error('Unexpected data type for currentPoll');
      }

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The poll has already started');
      // }

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);

      throw new InternalServerErrorException(`Failed to get pollID ${pollID}`);
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
      throw new InternalServerErrorException(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
    }
  }

  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    this.logger.log(`removing userID: ${userID} from poll: ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to remove userID: ${userID} from poll: ${pollID}`,
        e,
      );
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addNomination({
    pollID,
    nominationID,
    nomination,
  }: AddNominationData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a nomination with nominationID/nomination: ${nominationID}/${nomination.text} to pollID: ${pollID}`,
    );

    // base key of poll object
    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );

      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `Failed to add a nomination with nominationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to add a nomination with nominationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`,
      );
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    this.logger.log(
      `Removing nominationID: ${nominationID} from pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, nominationPath);

      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `Failed to remove nominationID: ${nominationID} from pollID: ${pollID}`,
        error,
      );

      throw new InternalServerErrorException(
        `Failed to remove nominationID: ${nominationID} from pollID: ${pollID}`,
      );
    }
  }

  async startPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Setting hasStarted for poll: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        '.hasStarted',
        JSON.stringify(true),
      );

      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(`Failed to set hasStarted for poll: ${pollID}`, error);

      throw new InternalServerErrorException(
        `There was an error starting the poll`,
      );
    }
  }

  async addParticipantRankings({
    pollID,
    userID,
    rankings,
  }: AddParticipantRankingsData): Promise<Poll> {
    this.logger.log(
      `Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`,
      rankings,
    );

    const key = `polls:${pollID}`;
    const rankingsPath = `.rankings.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        rankingsPath,
        JSON.stringify(rankings),
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add a rankings for userID/name: ${userID}/ to pollID: ${pollID}`,
        rankings,
      );
      throw new InternalServerErrorException(
        'There was an error starting the poll',
      );
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll> {
    this.logger.log(
      `Attempting to add results to pollID: ${pollID}`,
      JSON.stringify(results),
    );

    const key = `polls:${pollID}`;
    const resultsPath = `.results`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        resultsPath,
        JSON.stringify(results),
      );

      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `Failed to add results for pollID: ${pollID}`,
        results,
        error,
      );

      throw new InternalServerErrorException(
        `Failed to add results for pollID: ${pollID}`,
      );
    }
  }

  // When admin cancels the poll
  async deletePoll(pollID: string): Promise<void> {
    const key = `polls:${pollID}`;

    this.logger.log(`Deleting poll: ${pollID}`);

    try {
      await this.redisClient.call('JSON.DEL', key);
    } catch (error) {
      this.logger.error(`Failed to delete poll: ${pollID}`, error);

      throw new InternalServerErrorException(
        `Failed to delete poll: ${pollID}`,
      );
    }
  }
}
