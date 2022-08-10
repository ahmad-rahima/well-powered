import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeConsumptionGateway } from './realtime-consumption.gateway';

describe('RealtimeConsumptionGateway', () => {
  let gateway: RealtimeConsumptionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimeConsumptionGateway],
    }).compile();

    gateway = module.get<RealtimeConsumptionGateway>(RealtimeConsumptionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
