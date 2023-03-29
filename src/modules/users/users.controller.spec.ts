import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'

//TODO if user controller is used
describe.skip('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
