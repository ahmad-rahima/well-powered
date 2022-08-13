import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PopulateDBModule } from './populatedb/populatedb.module';
import { PowersModule } from './powers/powers.module';
import { CollegesModule } from './colleges/colleges.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { CollegesPowersModule } from './colleges-powers/colleges-powers.module';
import { ChartsModule } from './charts/charts.module';
import { RealtimeConsumptionModule } from './realtime-consumption/realtime-consumption.module';
import { LogsModule } from './logs/logs.module';
// import { MessagesGateway } from './messages/messages.gateway';
// import { WebPushModule } from './web-push/web-push.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { mongodbURI } from './keys';

// console.log(process.env.OPENSHIFT_MONGODB_DB_URL);
@Module({
  imports: [MongooseModule.forRoot(process.env.OPENSHIFT_MONGODB_DB_URL || mongodbURI),
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'client')
            }),
            PowersModule, CollegesModule, ConsumptionModule, CollegesPowersModule,
            ChartsModule, RealtimeConsumptionModule, PopulateDBModule, LogsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
