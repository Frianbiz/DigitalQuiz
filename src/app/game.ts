export class Game {
    public state: String;
    public activeUser: String;

    constructor(state: String, activeUser: String) {
        this.state = state;
        this.activeUser = activeUser;
    }
}
