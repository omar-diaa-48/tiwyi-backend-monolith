// import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { MinioService } from 'nestjs-minio-client';
// import sharp from 'sharp';

// import { editMinio } from './minio.service';
// import { createExtension, getExtension } from './utils';

// @Injectable()
// export class StorageService implements OnModuleInit {
//     constructor(private readonly minio: MinioService, private readonly config: ConfigService) {
//         this.logger = new Logger('MinioService');
//     }

//     private readonly logger: Logger;
//     private readonly bucketName = this.config.get('MINIO_DATA_BUCKET_NAME') as string;

//     public get client() {
//         return this.minio.client;
//     }

//     async updateGeneralFile(update: UpdateFile, type: MinioTypes, bucketName: string = this.bucketName) {
//         const { folder } = editMinio(type);
//         const { fileName, buffer, metaData } = createExtension(update.file);
//         await this.client?.removeObject(bucketName, folder + update.name).catch((err) => {
//             throw err;
//         });
//         await this.client.putObject(bucketName, folder + fileName, Buffer?.from(buffer), metaData).catch((err) => {
//             throw err;
//         });
//         return fileName;
//     }

//     async uplodGeneralFile(file: UploadFile, type: MinioTypes, bucketName: string = this.bucketName) {
//         const { fileName, buffer, metaData } = createExtension(file);

//         const { folder } = editMinio(type);
//         await this.client.putObject(bucketName, folder + fileName, Buffer?.from(file.buffer), metaData).catch((err) => {
//             throw err;
//         });
//         return fileName;
//     }

//     public async upload(
//         file: Express.Multer.File,
//         type: MinioTypes,
//         bucketName: string = this.bucketName
//     ): Promise<Record<string, string>> {
//         const { folder, error } = editMinio(type);
//         try {
//             const { fileName, buffer, metaData } = getExtension(file);

//             this.client.putObject(bucketName, folder + fileName, Buffer.from(buffer), metaData).catch((err) => {
//                 console.log(err);
//             });
//             return {
//                 url: fileName
//             };
//         } catch (er) {
//             console.log(er);
//             throw new HttpException(error, HttpStatus.BAD_REQUEST);
//         }
//     }

//     public async uploadVideoThumbnail(
//         thumbNail: Buffer,
//         filename: string,
//         type: MinioTypes,
//         bucketName: string = this.bucketName
//     ) {
//         const metaData = {
//             'Content-Type': 'png'
//         };
//         const { folder } = editMinio(type);
//         return await this.client
//             .putObject(bucketName, folder + 'thumbnails/' + filename, thumbNail, metaData)
//             .catch((err) => {
//                 throw err;
//             });
//     }

//     public async uploadThumbnail(
//         file: Express.Multer.File,
//         fileName: string,
//         bucketName: string = this.bucketName
//     ): Promise<void> {
//         try {
//             const { buffer, metaData } = getExtension(file);

//             const thumbNail = await sharp(Buffer.from(buffer))
//                 .resize({
//                     width: 150,
//                     height: 150
//                 })
//                 .withMetadata()
//                 .toBuffer();
//             this.client.putObject(bucketName, 'images/thumbnails/' + fileName, thumbNail, metaData).catch((err) => {
//                 console.log(err);
//                 throw new HttpException('Error creating thumbnail', HttpStatus.BAD_REQUEST);
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     public async getObject(path: string, bucketName: string = this.bucketName) {
//         return new Promise((resolve, reject) => {
//             this.client.getObject(bucketName, path, function (err, dataStream) {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 dataStream.on('data', function (chunk) {
//                     resolve(chunk);
//                 });
//                 dataStream.on('error', function (err) {
//                     console.log(err);
//                     reject();
//                 });
//             });
//         });
//     }

//     async delete(objetName: string, bucketName: string = this.bucketName) {
//         this.client.removeObject(bucketName, objetName).catch((_) => {
//             throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST);
//         });
//     }
//     async onModuleInit() {
//         const isBucketExist = await this.client.bucketExists(this.bucketName);
//         if (!isBucketExist) {
//             await this.client.makeBucket(this.bucketName);
//         }
//     }
// }