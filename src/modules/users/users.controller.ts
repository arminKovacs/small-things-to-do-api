import { Controller, /*  Param, Patch, */ UseGuards } from '@nestjs/common'
/* import { Body } from '@nestjs/common/decorators'
import { AjvValidationPipe } from 'src/common/pipes/AjvValidationPipe'
import { userIdPathSchema } from 'src/types/schemas/json-schemas/user-id.path.schema'
import { userBaseBodySchema } from 'src/types/schemas/json-schemas/user-base.body.schema'
import { UserDto } from 'src/types/dto/user-base.dto' */
import { UsersService } from './users.service'
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard'

// TBD if needed
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* @Patch(':userId')
  update(
    @Param('userId', new AjvValidationPipe(userIdPathSchema)) userId: string,
    @Body(new AjvValidationPipe(userBaseBodySchema)) userBase: UserDto,
  ) {
    return this.usersService.updateUser(userId, userBase)
  } */
}
