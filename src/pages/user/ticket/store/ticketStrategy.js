import strategies from './strategies'

export class TicketStrategy {
    constructor() {
        this.process = null;
    }
    setTicketProcess(process) {
        this.process = strategies[process];
    }
    handleStrategy(data, { dispatch, commit, state }) {
        this.process.handle(data, { dispatch, commit, state });
    }
}





