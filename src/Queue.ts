/**
 * Created by Dcalsky on 2017/4/20.
 */

interface Status {
    direction: {
        up: number,
        down: number
    },
    inDemand: boolean
}


class Queue {
    public floor: number
    public status: Status
    private passengers: Array<Person> = []
    private statusHook: Function

    constructor(f: number, statusHook: Function) {
        this.floor = f
        this.statusHook = statusHook
        this.status = {
            direction: {
                up: 0,
                down: 0
            },
            inDemand: false
        }
    }

    public addPassenger(person: Person) {
        this.passengers.push(person)
        this.changeStatus()
    }

    public board(upperNum: number = 0, elevatorDirection: DIRECTION) {
        let i = 0
        this.passengers.filter((passenger) => {
            let dest = passenger.destination - this.floor < 0 ? DIRECTION.DOWN : DIRECTION.UP // 负数向下，正数向上
            if (elevatorDirection === dest) {
                return ++i > upperNum
            }
            return true // True 为留下
        })
        this.changeStatus()
    }

    private changeStatus() {
        let up = DIRECTION.UP, down = DIRECTION.DOWN
        this.passengers.forEach((passenger) => {
            let dest = passenger.destination - this.floor // 负数向下，正数向上
            up = up | (dest > 0 ? 1 : 0)
            down = down | (dest < 0 ? 1 : 0)
        })
        this.status = {
            inDemand: this.passengers.length > 0,
            direction: { up, down }
        }
        this.statusHook(this.status)
    }


}