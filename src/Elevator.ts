/**
 * Created by Dcalsky on 2017/4/20.
 */

import Person from './Person'
import {ElevatorElement, FloorClick} from './Element'
import {Task, TaskType, TaskQueue, DIRECTION} from './Task'

export interface ArrivedCallback {
    (task: Task, e: Elevator): void
}

const EACH_FLOOR_SPEND = 500
export const MAX_CARRIED = 20

export default class Elevator {
    public direction: DIRECTION = DIRECTION.UP
    public floor: number = 1
    public carried: number = 0
    public running: boolean = false
    private passengers: Array<Person> = []
    private tasks: TaskQueue = new TaskQueue()
    private el: ElevatorElement
    private maxFloor: number

    constructor(maxFloor: number, parentContainer: HTMLElement) {
        this.el = new ElevatorElement(this.floorClickHandle, parentContainer)
        this.maxFloor = maxFloor
        this.updateStatus()
    }

    private floorClickHandle: FloorClick = (floor: number) => {
        const task = new Task(floor, TaskType.SEND, this.direction)
        if (floor !== this.floor) {
            this.el.lightOn(floor, true)
            this.addTask(task)
        }
    }

    public addPassengers(newPassengers: Array<Person>): void {
        this.carried += newPassengers.length
        this.passengers = this.passengers.concat(newPassengers)
        newPassengers.forEach((p: Person) => {
            this.el.addPassenger()
            this.addTask(new Task(p.destination, TaskType.SEND, this.direction))
        })
    }

    public addTask (task: Task): void {
        this.tasks.addTask(task)
        task.type === TaskType.SEND && this.el.lightOn(task.floor, true)
        !this.running && this.run()
    }

    public removeTask (task: Task): void {
        this.tasks.removeTask(task)
    }

    private deboard(): void {
        let len = 0,
            tasks = this.tasks.getTasksByType(TaskType.SEND, this.floor)
        tasks.length > 0 && this.removeTask(tasks[0])
        this.el.lightOn(this.floor, false)
        this.passengers = this.passengers.filter((p) => {
            if (p.destination !== this.floor) {
                return true
            } else {
                ++len
                return false
            }
        })
        this.carried -= len
        this.el.removePassengers(len)
    }

    private updateStatus(): void {
        this.el.updateStatus(this.floor, this.running)
    }

    public setDirection(): void {
        const reverseDirection = this.direction === DIRECTION.UP ? DIRECTION.DOWN : DIRECTION.UP
        this.direction = this.existInDirection() ? this.direction : reverseDirection
    }

    private existInDirection(): boolean {
        if (this.direction === DIRECTION.UP) {
            for (let i = this.floor + 1; i <= this.maxFloor; ++i) {
                let tasks = this.tasks.getTasksByFloor(i)
                if (tasks.length > 0) {
                    return true
                }
            }
            return false
        } else {
            for (let i = this.floor - 1; i > 0; --i) {
                let tasks = this.tasks.getTasksByFloor(i)
                if (tasks.length > 0) {
                    return true
                }
            }
            return false
        }
    }

    private handleTask() {
        let tasks = this.tasks.getTasksByFloor(this.floor)
        tasks.forEach(task => {
            if (task.type === TaskType.SEND) {
                this.deboard()
                this.removeTask(task)
            } else {
                // The condition of receiving passengers
                // If the number of passengers is out of the max carried, ignore
                if (this.carried >= MAX_CARRIED) return
                // If elevator's direction as same as task's direction, it means this elevator will stop and receive passengers
                if (this.existInDirection()) {
                    // Whether exists task in current direction
                    // If current direction is as same as the task direction, trigger the callback of this task to receive some passengers
                    this.direction === task.direction && task.cb(task, this)
                } else {
                    task.cb(task, this)
                }
            }
        })
    }

    private run() {
        // Flow: handle tasks of this floor -> determine current direction -> judge whether exists tasks -> update status
        this.running = true
        this.updateStatus()
        let timer = setInterval(() => {
            this.handleTask()
            this.setDirection()
            if (this.tasks.noTask()) {
                clearInterval(timer)
                this.running = false
            } else {
                this.direction === DIRECTION.UP ? this.floor ++ : this.floor --
            }
            this.updateStatus()
        }, EACH_FLOOR_SPEND)
    }
}
