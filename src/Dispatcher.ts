/**
 * Created by Dcalsky on 2017/4/20.
 */
import Queue, {Status} from "./Queue";
import Person from './Person'
import Elevator, {MAX_CARRIED} from './Elevator'
import {Task, TaskQueue, TaskType, DIRECTION} from './Task'
import {createElevator} from './Element'
import * as $ from 'jquery'

export enum TASK_SIGN {
    ADD = 1,
    REMOVE = 0
}

export default class Dispatcher {
    public elevators: Array<Elevator> = []
    public queue: Array<Queue> = []
    private tasks: TaskQueue = new TaskQueue()

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
        let task = new Task(floor, TaskType.GET, direction, this.arriveFloor.bind(this))
        this.tasks.addTask(task)
        this.emitElevator(task)
    }

    private emitElevator(task: Task, sign: TASK_SIGN = TASK_SIGN.ADD) {
        let elevators = this.getFreeElevators()
        if (sign === TASK_SIGN.REMOVE) {
            this.tasks.removeTask(task)
            this.elevators.forEach((elevator) => {
                elevator.removeTask(task)
            })
        } else {
            if (elevators.length > 0) {
                this.getElevatorByDistance(elevators, task.floor).addTask(task)
            } else {
                this.elevators.forEach((elevator) => {
                    elevator.addTask(task)
                })
            }
        }
    }

    private getElevatorByDistance (elevators: Elevator[], floor: number): Elevator {
        let distances: number[] = []
        elevators.forEach((e) => {
            distances.push(Math.abs(e.floor - floor))
        })
        return elevators[distances.indexOf(Math.min(...distances))]
    }

    private arriveFloor(task: Task, e: Elevator): void {
        this.emitElevator(task, TASK_SIGN.REMOVE)
        this.queue[task.floor].board(task.direction, MAX_CARRIED - e.carried, (p: Person[]) => {
            e.addPassengers(p)
        })
    }
    public statusHook(status: Status): void {
        status.directions.forEach(d => {
            this.addTask(status.floor, d)
        })
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
