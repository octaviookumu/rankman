import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PollsAuthGuard } from '../auth/polls-auth.guard';
import { CreatePollDto, JoinPollDto } from './dto';
import { PollsService } from './polls.service';
import { RequestWithAuth } from './types';

@UsePipes(new ValidationPipe())
@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}
  private readonly logger = new Logger(PollsAuthGuard.name);

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    const result = await this.pollsService.createPoll(createPollDto);
    return result;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    const result = await this.pollsService.joinPoll(joinPollDto);
    return result;
  }

  @UseGuards(PollsAuthGuard)
  @Post('/rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    const { name, userID, pollID } = request;
    const result = this.pollsService.rejoinPoll({
      name,
      pollID,
      userID,
    });

    return result;
  }
}
