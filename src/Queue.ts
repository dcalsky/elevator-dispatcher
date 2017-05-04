/**
 * Created by Dcalsky on 2017/4/20.
 */

import { DIRECTION } from './Elevator'
import Person from './Person'

interface QueueDirection {
    up: number,
    down: number
}

interface Status {
    floor?: number,
    direction: QueueDirection,
    inDemand: boolean
}


export default class Queue {
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

    public board(elevatorDirection: DIRECTION, cb: Function) {
        let passengers = []
        // for (let i = 0; i < this.passengers.length; ++i) {
        //     let p = this.passengers[i]
        //     //let dest = p.destination - this.floor < 0 ? DIRECTION.DOWN : DIRECTION.UP // 负数向下，正数向上
        //     //if (elevatorDirection === dest) {
        //         passengers.push(p)
        //         this.passengers.splice(i, 1)
        //     //}
        // }
        cb(this.passengers)
        this.passengers = []
    }

    private changeStatus() {
        let up = 0, down = 0
        this.passengers.forEach((passenger) => {
            let dest = passenger.destination - this.floor // 负数向下，正数向上
            up = up | (dest > 0 ? 1 : 0)
            down = down | (dest < 0 ? 1 : 0)
        })
        this.status = {
            floor: this.floor,
            inDemand: this.passengers.length > 0,
            direction: { up, down }
        }
        this.statusHook(this.status)
    }

}