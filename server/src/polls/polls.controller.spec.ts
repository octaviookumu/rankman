import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { PollsController } from './polls.controller';
import { PollsRepository } from './polls.repository';
import { PollsService } from './polls.service';
import { redisModule } from '../modules.config';

describe('PollsController', () => {
  let controller: PollsController;
  let pollsService: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        PollsService,
        {
          provide: JwtService,
          useValue: {}, // Use an empty object as a mock for JwtService
        },
        {
          provide: ConfigService,
          useValue: {}, // Use an empty object as a mock for ConfigService
        },
        {
          provide: Redis,
          useValue: {}, // Use an empty object as a mock for Redis
        },
        {
          provide: PollsRepository,
          useValue: {}, // Use an empty object as a mock for Redis
        },
      ],
      imports: [redisModule],
    }).compile();

    controller = module.get<PollsController>(PollsController);
    pollsService = module.get<PollsService>(PollsService); // Get the instance of PollsService to use in tests
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
