export class TagDT {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
    static fromJSON(json: unknown): TagDT {
        if (typeof json !== 'object' || json === null) {
            throw new Error("Invalid JSON format for TagDT");
        }

        const obj = json as { name?: unknown };

        if (typeof obj.name !== 'string') {
            throw new Error("Invalid JSON format: 'name' must be a string");
        }

        return new TagDT(obj.name);
    }
}
