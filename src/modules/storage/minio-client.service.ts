import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as sharp from 'sharp';
import { StorageTypeErrors, StorageTypes } from './libs/storage-types.enum';

@Injectable()
export class MinioClientService implements OnModuleInit {
    constructor(private readonly minio: MinioService, private readonly config: ConfigService) {
        this.logger = new Logger('MinioService');
    }

    private readonly logger: Logger;
    private readonly bucketName = this.config.get('MINIO_DATA_BUCKET_NAME') as string;

    public get client() {
        return this.minio.client;
    }

    public async uploadAttachment(file: Express.Multer.File, type: StorageTypes, bucketName: string = this.bucketName): Promise<string> {
        const { folder } = this.generateMinioMeta(type);

        try {
            const { fileName, buffer, metaData } = this.getExtension(file);

            this.client.putObject(bucketName, folder + fileName, Buffer.from(buffer), metaData).catch((err) => {
                console.log(err);
            });

            return `${folder}/${fileName}`
        } catch (error) {
            console.error(error);
            throw new HttpException('Error uploading attachment', HttpStatus.BAD_REQUEST);
        }
    }

    public async uploadThumbnail(
        file: Express.Multer.File,
        bucketName: string = this.bucketName
    ): Promise<string> {
        try {
            const folder = 'images/thumbnails'
            const { fileName, buffer, metaData } = this.getExtension(file);

            const thumbNail = await sharp(Buffer.from(buffer))
                .resize({
                    width: 150,
                    height: 150
                })
                .withMetadata()
                .toBuffer();

            await this.client.putObject(bucketName, folder + fileName, thumbNail, metaData)

            return fileName
        } catch (error) {
            console.error(error);
            throw new HttpException('Error uploading thumbnail', HttpStatus.BAD_REQUEST);
        }
    }

    // async updateGeneralFile(update: UpdateFile, type: MinioTypes, bucketName: string = this.bucketName) {
    //     const { folder } = editMinio(type);
    //     const { fileName, buffer, metaData } = createExtension(update.file);
    //     await this.client?.removeObject(bucketName, folder + update.name).catch((err) => {
    //         throw err;
    //     });
    //     await this.client.putObject(bucketName, folder + fileName, Buffer?.from(buffer), metaData).catch((err) => {
    //         throw err;
    //     });
    //     return fileName;
    // }

    // async uploadGeneralFile(file: UploadFile, type: MinioTypes, bucketName: string = this.bucketName) {
    //     const { fileName, buffer, metaData } = createExtension(file);

    //     const { folder } = editMinio(type);
    //     await this.client.putObject(bucketName, folder + fileName, Buffer?.from(file.buffer), metaData).catch((err) => {
    //         throw err;
    //     });
    //     return fileName;
    // }

    // public async upload(
    //     file: Express.Multer.File,
    //     type: MinioTypes,
    //     bucketName: string = this.bucketName
    // ): Promise<Record<string, string>> {
    //     const { folder, error } = editMinio(type);
    //     try {
    //         const { fileName, buffer, metaData } = getExtension(file);

    //         this.client.putObject(bucketName, folder + fileName, Buffer.from(buffer), metaData).catch((err) => {
    //             console.log(err);
    //         });
    //         return {
    //             url: fileName
    //         };
    //     } catch (er) {
    //         console.log(er);
    //         throw new HttpException(error, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // public async uploadVideoThumbnail(
    //     thumbNail: Buffer,
    //     filename: string,
    //     type: MinioTypes,
    //     bucketName: string = this.bucketName
    // ) {
    //     const metaData = {
    //         'Content-Type': 'png'
    //     };
    //     const { folder } = editMinio(type);
    //     return await this.client
    //         .putObject(bucketName, folder + 'thumbnails/' + filename, thumbNail, metaData)
    //         .catch((err) => {
    //             throw err;
    //         });
    // }

    // public async uploadThumbnail(
    //     file: Express.Multer.File,
    //     fileName: string,
    //     bucketName: string = this.bucketName
    // ): Promise<void> {
    //     try {
    //         const { buffer, metaData } = getExtension(file);

    //         const thumbNail = await sharp(Buffer.from(buffer))
    //             .resize({
    //                 width: 150,
    //                 height: 150
    //             })
    //             .withMetadata()
    //             .toBuffer();
    //         this.client.putObject(bucketName, 'images/thumbnails/' + fileName, thumbNail, metaData).catch((err) => {
    //             console.log(err);
    //             throw new HttpException('Error creating thumbnail', HttpStatus.BAD_REQUEST);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // public async getObject(path: string, bucketName: string = this.bucketName) {
    //     return new Promise((resolve, reject) => {
    //         this.client.getObject(bucketName, path, function (err, dataStream) {
    //             if (err) {
    //                 return console.log(err);
    //             }
    //             dataStream.on('data', function (chunk) {
    //                 resolve(chunk);
    //             });
    //             dataStream.on('error', function (err) {
    //                 console.log(err);
    //                 reject();
    //             });
    //         });
    //     });
    // }

    async delete(objetName: string, bucketName: string = this.bucketName) {
        this.client.removeObject(bucketName, objetName).catch((_) => {
            throw new HttpException('An error occurred when deleting!', HttpStatus.BAD_REQUEST);
        });
    }

    async onModuleInit() {
        const isBucketExist = await this.client.bucketExists(this.bucketName);
        if (!isBucketExist) {
            await this.client.makeBucket(this.bucketName);
        }
    }

    private getExtension(file: Express.Multer.File): { fileName: string, fileExtension: string, buffer: Buffer, metaData: Record<string, string> } {
        const fileName = file.originalname;
        const fileExtension = fileName.split('.').pop();
        const buffer = file.buffer;

        const metaData = {
            'Content-Type': file.mimetype,
        };

        return { fileName, buffer, metaData, fileExtension };
    }

    private generateMinioMeta(type: StorageTypes): Record<string, string> {
        let folder = '';
        let error = '';

        switch (type) {
            case StorageTypes.image:
                folder = 'images';
                break;
            case StorageTypes.video:
                folder = 'videos';
                break;
            case StorageTypes.pdf:
                folder = 'pdf';
                break;
            case StorageTypes.corporate_logo:
            case StorageTypes.corporate_logo_update:
                folder = 'corporate/corporateLogo';
                break;
            case StorageTypes.candidate_documents:
            case StorageTypes.candidate_documents_update:
                folder = 'candidate/documents';
                break;
            case StorageTypes.candidate_images:
                folder = 'candidate/images';
                break;
            case StorageTypes.corporate_documents:
                folder = 'corporate/documents';
                break;
            case StorageTypes.corporate_videos:
                folder = 'corporate/videos';
                break;
            case StorageTypes.candidate_videos:
                folder = 'candidate/videos';
                break;
            case StorageTypes.corporate_images:
                folder = 'corporate/images';
                break;
            case StorageTypes.corporate_test_question:
            case StorageTypes.corporate_test_question_update:
                folder = 'corporate/test';
                break;
            case StorageTypes.candidate_test_answer:
            case StorageTypes.candidate_test_answer_update:
                folder = 'corporate/test/answers';
                break;
            case StorageTypes.task_attachment:
                folder = 'task/attachments';
                break;
            default:
                folder = '';
                break;
        }

        switch (type) {
            case StorageTypes.image:
                error = StorageTypeErrors.image;
                break;
            case StorageTypes.video:
                error = StorageTypeErrors.video;
                break;
            case StorageTypes.pdf:
                error = StorageTypeErrors.pdf;
                break;
            default:
                '';
                break;
        }

        return { folder, error };
    };
}