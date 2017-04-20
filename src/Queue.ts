/**
 * Created by Dcalsky on 2017/4/20.
 */

interface DirectionStatus {
    up: number
    down: number
}


class Queue {
    public floor: number

    public directionStatus: DirectionStatus
    private passengers: Array<Person> = []
    private statusTrigger: Function

    constructor(f: number, statusHook: Function) {
        this.floor = f
        this.statusTrigger = statusHook
    }

    public addPassenger(person: Person) {
        this.passengers.push(person)
        this.changeStatus(person.destination)
    }

    public board(num: number = 0, elevatorDirection: number) {
        this.passengers.filter((passenger) => {
            return passenger.destination !== elevatorDirection
        })
        this.changeStatus()
    }

    private changeStatus(direction: DIRECTION) {
        this.directionStatus.up = this.directionStatus.up | direction
        this.statusTrigger(this) //todo too many properties
    }


}