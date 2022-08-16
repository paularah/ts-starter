import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MaritalStatus, VerificationStatus } from 'src/common/enums/user.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: number;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfbirth: string;

  @Prop({ enum: MaritalStatus })
  maritalStatus: string;

  @Prop()
  nationality: string;

  @Prop({ required: true, minlength: 6, maxlength: 500 })
  password: string;

  @Prop()
  authtype: string;

  @Prop({ enum: VerificationStatus, default: 'UNVERIFIED' })
  verification: string;

  @Prop()
  idType: string;

  @Prop()
  id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
