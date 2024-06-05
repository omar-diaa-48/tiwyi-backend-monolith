import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioClientService } from './libs/minio-client.service';
import { StorageTypes } from './libs/storage-types.enum';

@Injectable()
export class StorageMicroService {
    constructor(private minioClientService: MinioClientService) { }

    async uploadAttachment(file: Express.Multer.File): Promise<Record<string, string>> {
        try {
            const link: Record<string, string> = await this.minioClientService.uploadAttachment(file, StorageTypes.task_attachment);
            await this.minioClientService.uploadThumbnail(file, link?.url);
            return link;
        } catch (error) {
            throw new HttpException('Unable to upload the attachment: ' + error, HttpStatus.BAD_REQUEST);
        }
    }

    // async uploadFile(file: Express.Multer.File): Promise<Record<string, string>> {
    //     try {
    //         const link: Record<string, string> = await this.minioService.upload(file, MinioTypes.image);
    //         await this.minioService.uploadThumbnail(file, link?.url);
    //         return link;
    //     } catch (error) {
    //         throw new HttpException(MinioTypeErrors.image, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // async uploadGeneralFile(file: UploadFile, type: MinioTypes) {
    //     const link: string = await this.minioService.uplodGeneralFile(file, type);
    //     switch (type) {
    //         case MinioTypes.candidate_videos:
    //             await this.uploadVideo(file, link, type);
    //             break;
    //         case MinioTypes.corporate_videos:
    //             await this.uploadVideo(file, link, type);
    //             break;
    //         default:
    //             break;
    //     }
    //     return link;
    // }

    // async updateGeneralFile(update: UpdateFile, type: MinioTypes) {
    //     const link: string = await this.minioService.updateGeneralFile(update, type);
    //     return link;
    // }

    // async uploadPdf(file: Express.Multer.File) {
    //     try {
    //         const link: Record<string, string> = await this.minioService.upload(file, MinioTypes.pdf);
    //         return link;
    //     } catch (error) {
    //         console.log(error);
    //         throw new HttpException(MinioTypeErrors.pdf, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // async uploadVideo(file: UploadFile, url: string, type: MinioTypes): Promise<Record<string, string>> {
    //     try {
    //         const videoFileName = url;
    //         const currentDirectory = process.cwd();
    //         const timestamp = Date.now().toString();

    //         const folderName = crypto.createHash('md5').update(timestamp).digest('hex');
    //         const folderPath = path.join(currentDirectory, folderName);
    //         if (!fs.existsSync(folderPath)) {
    //             fs.mkdirSync(folderPath);
    //         }
    //         const videoFilePath = path.join(folderPath, videoFileName);
    //         fs.writeFileSync(videoFilePath, Buffer.from(file?.buffer));

    //         return new Promise<any>((resolve, reject) => {
    //             const fileName = videoFileName + '.png';
    //             Ffmpeg(videoFilePath, {})
    //                 .screenshots({
    //                     timestamps: ['10%'],
    //                     filename: fileName,
    //                     folder: folderPath,
    //                     size: '150x150'
    //                 })
    //                 .on('end', async () => {
    //                     const thumbnail: Buffer = fs.readFileSync(`${folderPath}/${fileName}`);
    //                     return await this.minioService.uploadVideoThumbnail(thumbnail, fileName, type).then(() => {
    //                         fs.rmSync(folderPath, { recursive: true, force: true });
    //                         resolve(true);
    //                     });
    //                 })
    //                 .on('error', (err) => {
    //                     reject(err);
    //                 });
    //         }).catch((err) => {
    //             console.log(err);
    //             throw err;
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error(MinioTypeErrors.video);
    //     }
    // }
}