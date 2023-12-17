export class Tag {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
    static fromJSON(json: any): Tag {
        return new Tag(json.name);
    }
}
