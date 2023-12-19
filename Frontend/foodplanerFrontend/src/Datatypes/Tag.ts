export class TagDT {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
    static fromJSON(json: any): TagDT {
        return new TagDT(json.name);
    }
}
