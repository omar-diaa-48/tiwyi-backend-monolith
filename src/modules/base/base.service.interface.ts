export interface IHasGenerateDefaultItem<T> {
    generateDefaultItem(...args: any[]): Omit<T, "id">
}