import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { BooksModule } from './books/books.module';
import { ChaptersModule } from './chapters/chapters.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ElementsModule } from './elements/elements.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagesModule } from './pages/pages.module';
import { PublishingModule } from './publishing/publishing.module';
import { PrismaModule } from './prisma/prisma.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { validateEnv } from './config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: '.env',
      validate: validateEnv
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    AuthorizationModule,
    UsersModule,
    BooksModule,
    ChaptersModule,
    PagesModule,
    ElementsModule,
    AssetsModule,
    TemplatesModule,
    PublishingModule,
    DashboardModule,
    FavoritesModule,
    NotificationsModule
  ]
})
export class AppModule {}