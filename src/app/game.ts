export class Game {
    public state: String;
    public activeUser: String;
    public question: number;

    constructor(state: String, activeUser: String, question: number) {
        this.state = state;
        this.activeUser = activeUser;
        this.question = question;
    }
}
