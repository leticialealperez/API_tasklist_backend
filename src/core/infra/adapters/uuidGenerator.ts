import { v4 } from "uuid";

export class GenerateUid {
    static newUUID = () => {
        return v4();
    };
}
