export class Game {
    public state: String;
    public user: String;
    public questionIndex: number;

    constructor(state: String, activeUser: String, questionIndex: number) {
        this.state = state;
        this.user = activeUser;
        this.questionIndex = questionIndex;
    }
}
