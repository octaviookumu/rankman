import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { PollsRepository } from './polls.repository';
import { PollsService } from './polls.service';

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: ConfigService,
          useValue: {}, // Use an empty object as a mock for ConfigService
        },
        {
          provide: Redis,
          useValue: {}, // Use an empty object as a mock for Redis
        },
        {
          provide: JwtService,
          useValue: {}, // Use an empty object as a mock for JwtService
        },
        {
          provide: PollsRepository,
          useValue: {}, // Use an empty object as a mock for Redis
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
