export interface UseCase {
    run(data: any): Promise<any>;
}
