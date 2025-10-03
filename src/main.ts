import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  if (process.env.NODE_ENV !== "production") {
    const { SwaggerModule, DocumentBuilder } = await import("@nestjs/swagger");
    const config = new DocumentBuilder()
      .setTitle("API Documentation")
      .setDescription("The API description")
      .addApiKey(
        {
          type: "apiKey",
          name: "x-scheduler-header",
          in: "header",
          description: "Enter your custom authentication token",
        },
        "x-scheduler-header",
      )
      .addSecurityRequirements("x-scheduler-header", [])
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
