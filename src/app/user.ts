export class User {
    public name: string;
    public status: string;
    public statusLibelle: string;
    public score: Number;

    constructor(name: string, score: Number, status: string, statusLibelle: string) {
        this.name = name;
        this.score = score;
        this.status = status;
        this.statusLibelle = statusLibelle;
    }
}
