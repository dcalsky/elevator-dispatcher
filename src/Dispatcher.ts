/**
 * Created by Dcalsky on 2017/4/20.
 */
import Queue from "./Queue";
import Person from './Person'
import {Elevator, DIRECTION, TaskType} from './Elevator'
import {createElevator} from './Element'
import * as $ from 'jquery'

export enum TASK_SIGN {
    ADD = 1,
    REMOVE = 0
}

export class Task {
    public direction: DIRECTION
    constructor(d: DIRECTION) {
        this.direction = d
    }
}

export default class Dispatcher {
    public elevators: Array<Elevator> = []
    public queue: Array<Queue> = []
    public totalFloor: number
    private tasks: Array<Task>[] = []

    constructor(elevatorNum: number, totalFloor: number, parentContainer: HTMLElement) {
        for (let i = 1; i <= elevatorNum; ++i) {
            let el = createElevator()
            $(parentContainer).append(el)
            this.elevators.push(new Elevator(el, totalFloor))
        }
        for (let i = 1; i <= totalFloor; ++i) {
            this.statusHook = this.statusHook.bind(this)
            this.queue[i] = new Queue(i, this.statusHook)
        }
    }
    public dispatchPassengerToQueue(person: Person) {
        this.queue[person.floor].addPassenger(person)
    }
    private addTask (floor: number, direction: DIRECTION) {
        if (!this.tasks[floor]) this.tasks[floor] = []
        let newTask = new Task(direction)
        this.tasks[floor].push(newTask)
        this.emitElevator(floor)
    }
    private emitElevator(floor: number, sign: TASK_SIGN = TASK_SIGN.ADD) {
        let cb = this.arriveFloor.bind(this)
        let elevators = this.getFreeElevators()
        if (sign === TASK_SIGN.REMOVE) {
            this.elevators.forEach((elevator) => {
                elevator.removeTask(floor, TaskType.GET)
            })
        } else {
            if (elevators.length > 0) {
                this.getElevatorByDistance(elevators, floor).addTask(floor, cb, TaskType.GET)
            } else {
                this.elevators.forEach((elevator) => {
                    elevator.addTask(floor, cb, TaskType.GET)
                })
            }
        }
    }
    private getElevatorByDistance (eles: Elevator[], floor: number): Elevator {
        let distances: number[] = []
        eles.forEach((e) => {
            distances.push(Math.abs(e.floor - floor))
        })
        return eles[distances.indexOf(Math.min(...distances))]
    }
    private board(floor: number, direction: DIRECTION, e: Elevator) {
        this.queue[floor].board(direction, (p: Person[]) => {
            e.addPassenger(p)
            $('.queue').children().slice(1, p.length + 1).remove() // todo: It's not a good design
        })
    }
    private arriveFloor(floor: number, direction: DIRECTION, e: Elevator) {
        let task = this.tasks[floor],
            directions = task.map(_ => _.direction)
        // if (directions.indexOf(direction) !== -1 || e.running === false) {
        this.emitElevator(floor, TASK_SIGN.REMOVE)
        this.board(floor, direction, e)

        // }
    }
    public statusHook(status) {
        if (status.inDemand) {
            if (status.direction.up === 1) this.addTask(status.floor, DIRECTION.UP)
            if (status.direction.down === 1) this.addTask(status.floor, DIRECTION.DOWN)
        }
    }
    private getFreeElevators(): Array<Elevator> {
        let elevators = []
        this.elevators.forEach((e) => {
            if (!e.running) {
                elevators.push(e)
            }
        })
        return elevators.length > 0 ? elevators : []
    }
}
