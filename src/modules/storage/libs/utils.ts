// import { v4 as uuidv4 } from 'uuid';

// export const createExtension = (file: UploadFile) => {
//     const mimetype = file.mimetype;
//     const extension = file.fileName?.substring(file.fileName.lastIndexOf('.'), file.fileName?.length);
//     const name = uuidv4();
//     const fileName = name + extension;
//     const metaData = {
//         'Content-Type': file.mimetype
//     };
//     return {
//         mimetype,
//         extension,
//         name,
//         fileName,
//         metaData,
//         buffer: file?.buffer
//     };
// };
// export const getExtension = (file: Express.Multer.File) => {
//     const mimetype = file.mimetype;
//     const extension = file.originalname?.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
//     const name = uuidv4();
//     const fileName = name + extension;
//     const metaData = {
//         'Content-Type': file.mimetype
//     };

//     return {
//         mimetype,
//         extension,
//         name,
//         fileName,
//         metaData,
//         buffer: file.buffer
//     };
// };