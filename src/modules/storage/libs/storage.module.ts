// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MinioModule } from 'nestjs-minio-client';
// import { MinioClientService } from './minio-client.service';

// @Module({
//     imports: [
//         MinioModule.registerAsync({
//             imports: [ConfigModule],
//             useFactory: async (configService: ConfigService) => ({
//                 endPoint: configService.get('MINIO_ENDPOINT'),
//                 port: Number(configService.get('MINIO_PORT')),
//                 useSSL: false, // If on localhost, keep it at false. If deployed on https, change to true
//                 accessKey: configService.get('MINIO_ROOT_USER'),
//                 secretKey: configService.get('MINIO_ROOT_PASSWORD')
//             }),
//             inject: [ConfigService]
//         })
//     ],
//     providers: [MinioClientService, ConfigService],
//     exports: [MinioClientService]
// })
// export class MinioClientModule { }