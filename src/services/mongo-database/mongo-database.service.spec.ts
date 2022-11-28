import { Test, TestingModule } from '@nestjs/testing'
import { MongoDatabaseService } from './mongo-database.service'

describe('MongoDatabaseService', () => {
  let service: MongoDatabaseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDatabaseService],
    }).compile()

    service = module.get<MongoDatabaseService>(MongoDatabaseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
