export type TopicActionType = 'create' | 'read' | 'update' | 'delete'

export type TopicNameType = `${TopicActionType}.${string}`