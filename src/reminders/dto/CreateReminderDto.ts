import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum ChannelType {
  MAIL = "mail",
  DATABASE = "database",
}

export class CreateReminderDto {
  @ApiProperty({ enum: ["mail", "database"], description: "Channel type" })
  @IsEnum(ChannelType)
  channel: ChannelType;

  @ApiProperty({ description: "Message" })
  @IsString()
  message: string;

  @ApiProperty({
    type: String,
    format: "date-time",
    description: "ISO date string",
  })
  @IsISO8601()
  time: string;

  @ApiPropertyOptional({ description: "Email address (optional)" })
  @IsOptional()
  @IsEmail()
  email?: string;
}
