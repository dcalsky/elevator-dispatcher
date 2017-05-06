/**
 * Created by Dcalsky on 2017/4/20.
 */

import Person from './Person'
import { DIRECTION } from './Task'
import * as $ from 'jquery'

interface Status {
    floor?: number,
    directions: DIRECTION[],
}

export default class Queue {
    public floor: number
    public status: Status
    private passengers: Array<Person> = []
    private statusHook: Function

    constructor(f: number, statusHook: Function) {
        this.floor = f
        this.statusHook = statusHook
    }

    public addPassenger(person: Person) {
        this.passengers.push(person)
        this.changeStatus()
    }

    public board(direction: DIRECTION, carried: number, cb: Function) {
        let passengers: Array<Person> = [],
            len = 0
        this.passengers = this.passengers.filter((passenger) => {
            if (len >= carried) return true

            let dest = passenger.destination - this.floor > 0 ? DIRECTION.UP : DIRECTION.DOWN
            if (dest === direction) {
                ++len
                passengers.push(passenger)
                return false
            }
            return true
        })
        $('.queue').children().slice(1, passengers.length + 1).remove()
        cb(passengers)
        this.changeStatus()
    }

    private changeStatus() {
        let up = 0, down = 0, directions: DIRECTION[] = []
        this.passengers.forEach((passenger) => {
            let dest = passenger.destination - this.floor
            up = up | (dest > 0 ? 1 : 0)
            down = down | (dest < 0 ? 1 : 0)
        })
        up === 1 && directions.push(DIRECTION.UP)
        down === 1 && directions.push(DIRECTION.DOWN)
        this.status = {
            floor: this.floor,
            directions
        }
        this.statusHook(this.status)
    }
}
