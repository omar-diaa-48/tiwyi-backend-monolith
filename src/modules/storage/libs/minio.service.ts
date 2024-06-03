// export const editMinio = (type: MinioTypes): Record<string, string> => {
//     let folder = '';
//     let error = '';

//     switch (type) {
//         case MinioTypes.image:
//             folder = 'images/';
//             break;
//         case MinioTypes.video:
//             folder = 'videos/';
//             break;
//         case MinioTypes.pdf:
//             folder = 'pdf/';
//             break;
//         case MinioTypes.corporate_logo:
//             folder = 'corporate/corporateLogo/';
//             break;
//         case MinioTypes.corporate_logo_update:
//             folder = 'corporate/corporateLogo/';
//             break;
//         case MinioTypes.candidate_documents:
//             folder = 'candidate/documents/';
//             break;
//         case MinioTypes.candidate_documents_update:
//             folder = 'candidate/documents/';
//             break;
//         case MinioTypes.candidate_images:
//             folder = 'candidate/images/';
//             break;
//         case MinioTypes.corporate_documents:
//             folder = 'corporate/documents/';
//             break;
//         case MinioTypes.corporate_videos:
//             folder = 'corporate/videos/';
//             break;
//         case MinioTypes.candidate_videos:
//             folder = 'candidate/videos/';
//             break;
//         case MinioTypes.corporate_images:
//             folder = 'corporate/images/';
//             break;
//         case MinioTypes.corporate_test_question:
//             folder = 'corporate/test/';
//             break;
//         case MinioTypes.corporate_test_question_update:
//             folder = 'corporate/test/';
//             break;
//         case MinioTypes.candidate_test_answer:
//             folder = 'corporate/test/answers';
//             break;
//         case MinioTypes.candidate_test_answer_update:
//             folder = 'corporate/test/answers';
//             break;
//         default:
//             '/';
//             break;
//     }
//     switch (type) {
//         case MinioTypes.image:
//             error = MinioTypeErrors.image;
//             break;
//         case MinioTypes.video:
//             error = MinioTypeErrors.video;
//             break;
//         case MinioTypes.pdf:
//             error = MinioTypeErrors.pdf;
//             break;
//         default:
//             '';
//             break;
//     }
//     return { folder, error };
// };