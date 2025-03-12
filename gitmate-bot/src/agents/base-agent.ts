
export interface  BaseAgent<I, O> {
    handleEvent(event: I): Promise<O>
}