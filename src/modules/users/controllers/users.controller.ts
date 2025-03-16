import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyProfile(@CurrentUser() user: any) {
    return this.userService.getUserById(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (id !== user.id && !user.isAdmin) {
      throw new ForbiddenException('Unauthorized to access this user profile');
    }
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any
  ) {
    if (id !== user.id && !user.isAdmin) {
      throw new ForbiddenException('Unauthorized to update this user');
    }

    if (updateUserDto.isAdmin === true && !user.isAdmin) {
      throw new ForbiddenException('Only administrators can grant admin privileges');
    }

    return this.userService.updateUser(id, updateUserDto);
  }
}