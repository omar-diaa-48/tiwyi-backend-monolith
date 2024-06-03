// export async function fileUpload(file: FileUpload) {
//     const _buf = Array<any>();
//     return new Promise((resolve, reject) => {
//         file
//             .createReadStream()
//             .on('data', (chunk: any) => _buf.push(chunk))
//             .on('end', () => {
//                 resolve({
//                     buffer: Buffer.concat(_buf),
//                     fileName: file?.filename,
//                     mimetype: file?.mimetype,
//                     encoding: file?.encoding
//                 });
//             })
//             .on('error', (error: any) => {
//                 reject(error);
//             });
//     });
// }
// export async function streamUpload(file: FileUpload) {
//     try {
//         const { createReadStream, filename, mimetype, encoding } = await file;
//         const stream = createReadStream();

//         if (mimetype === 'image/png' || mimetype === 'image/jpg' || mimetype === 'image/jpeg') {
//             return { filename, mimetype, encoding, stream };
//         } else return console.log('Wrong file type or the file is too big!');
//     } catch (error) {
//         console.log(error);
//     }
// }