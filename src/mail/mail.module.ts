import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailService } from "./services/mail.service";
import mailConfig from "./mail.config";

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("mail.host"),
          port: configService.get("mail.port"),
          secure: configService.get("mail.secure"),
          auth: {
            user: configService.get("mail.auth.user"),
            pass: configService.get("mail.auth.pass"),
          },
        },
        defaults: {
          from: `"${configService.get("mail.from.name")}" <${configService.get("mail.from.email")}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
