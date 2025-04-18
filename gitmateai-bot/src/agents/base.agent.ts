
export interface  BaseAgent<I, O> {
    handleEvent(input: I): Promise<O>
}