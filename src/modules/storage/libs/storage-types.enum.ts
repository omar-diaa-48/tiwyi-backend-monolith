export enum StorageTypes {
    video,
    image,
    pdf,
    video_thumbnail,
    image_thumbnail,

    corporate_images,
    corporate_documents,
    corporate_videos,
    corporate_logo,
    corporate_test_question,
    corporate_logo_update,
    corporate_test_question_update,

    candidate_documents,
    candidate_documents_update,
    candidate_images,
    candidate_videos,
    candidate_test_answer,
    candidate_test_answer_update,
    candidate_videos_update,

    documents,
    documents_update,

    task_attachment
}

export enum StorageTypeErrors {
    video = 'Error adding image',
    image = 'Error adding video',
    pdf = 'Error adding pdf'
}