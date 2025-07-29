export class MessageSender {
    private readonly delayMs: number

    constructor(minDelaySeconds: number = 2) {
        this.delayMs = minDelaySeconds * 1000
    }

    async send<T>(task: () => Promise<T>): Promise<T> {
        await this.delay(this.delayMs)
        return await task()
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}
