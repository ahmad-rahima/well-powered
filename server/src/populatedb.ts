import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PopulateDBModule } from './populatedb/populatedb.module';
import { PopulateDBService } from './populatedb/populatedb.service';


async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    let populatedbService = app.select(PopulateDBModule).get(PopulateDBService);

    await populatedbService.populate();
    console.log("populatedb: Finished");
    app.close();
}
bootstrap();
