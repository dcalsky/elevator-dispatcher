/**
 * Created by Dcalsky on 2017/4/20.
 */


class Dispatcher {
    public elevators: Array<Elevator> = []
    public queue: Array<Queue> = []

    constructor(elevatorNum: number, QueueNum: number) {
        let statusHook = (queue) => {

        }
        for (let i = 0; i < elevatorNum; ++i) {
            this.elevators.push(new Elevator())
        }

        for (let i = 1; i <= QueueNum; ++i) {
            this.queue.push(new Queue(i), statusHook)
        }
    }

    private dispatchElevator() {
        // 距离最近 并且方向相同就给它
    }


}