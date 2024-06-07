export const TASK_BOARD_COLUMN_INCLUDES = {
    taskMembers: {
        include: {
            member: true
        }
    },
    taskTags: {
        select: {
            projectTagId: true
        }
    },
    taskAttachments: {
        select: {
            url: true,
            thumbnails: {
                select: {
                    url: true
                }
            },
        }
    },
    taskComments: {
        select: {
            id: true,
        }
    }
} as const

export const TASK_BOARD_CARD_INCLUDES = {
    taskComments: true,
    taskMembers: {
        include: {
            member: true
        }
    },
    dependsOnTask: {
        select: {
            title: true
        }
    },
    dependentTasks: {
        select: {
            _count: true
        }
    },
    parentTask: {
        select: {
            title: true
        }
    },
    childTasks: {
        select: {
            _count: true
        }
    },
    taskTags: {
        include: {
            projectTag: true
        }
    },
    taskAttachments: {
        include: {
            thumbnails: true
        }
    },
    worksheet: true,
    createdBy: true,
} as const