import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * uses the partialType utility class from  swagger to allow generating spec automaitically =
 * @todo exclude password from updates since passowrd has to be updated by reseting
 *  */
export class UpdateUser extends PartialType(CreateUserDto) {}
