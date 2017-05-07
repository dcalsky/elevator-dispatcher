/**
 * Created by Dcalsky on 2017/4/20.
 */

import * as $ from 'jquery'
import Person from './Person'
import {createPassenger} from './Element'
import {Task, TaskType, TaskQueue, DIRECTION} from './Task'

const EACH_FLOOR_SPEND = 500
export const MAX_CARRIED = 20

export default class Elevator {
    public direction: DIRECTION = DIRECTION.UP
    public floor: number = 1
    public carried: number = 0
    public running: boolean = false
    private passengers: Array<Person> = []
    private tasks: TaskQueue = new TaskQueue()
    private el: JQuery
    private el_passengers: JQuery
    private maxFloor: number

    constructor(el: JQuery, maxFloor: number) {
        this.el = el
        this.el_passengers = this.el.find('.passengers')
        this.el.children('.floors').click(this.floorClickHandle.bind(this))
        this.maxFloor = maxFloor
        this.setFloorElement()
    }

    public addPassengers(newPassengers: Array<Person>): void {
        this.carried += newPassengers.length
        this.passengers = this.passengers.concat(newPassengers)
        newPassengers.forEach((p: Person) => {
            this.element_addPassenger()
            this.addTask(new Task(p.destination, TaskType.SEND, this.direction))
        })
    }

    private element_addPassenger() {
        this.el_passengers.append(createPassenger())
    }

    private floorClickHandle(event) {
        const floor = $(event.target),
            id = parseInt(floor.data('id')),
            task = new Task(id, TaskType.SEND, this.direction)
        if (id !== this.floor) {
            floor.addClass('active')
            this.addTask(task)
        }
    }

    private element_floorLightHandle(floor: number, on: boolean) {
        let light = this.el.find('.floors').children().filter(`[data-id="${floor}"]`)
        on ? light.addClass('active') : light.removeClass('active')
    }

    public addTask (task: Task): void {
        this.tasks.addTask(task)
        task.type === TaskType.SEND && this.element_floorLightHandle(task.floor, true)
        !this.running && this.run()
    }

    public removeTask (task: Task): void {
        this.tasks.removeTask(task)
    }

    private deboard(): void {
        let len = 0,
            tasks = this.tasks.getTasksByType(TaskType.SEND, this.floor)
        tasks.length > 0 && this.removeTask(tasks[0])
        this.element_floorLightHandle(this.floor, false)
        this.passengers = this.passengers.filter((p) => {
            if (p.destination !== this.floor) {
                return true
            } else {
                ++len
                return false
            }
        })
        this.carried -= len
        this.el_passengers.children().slice(0, len).remove()
    }

    private setFloorElement(): void {
        let status = this.el.children('.status')
        status.children('.floor').text(`${this.floor}F`)
        if (this.running) {
            status.children('.text').text('Running')
            status.children('.text').removeClass('free')
            status.children('.text').addClass('running')
        } else {
            status.children('.text').text('Free')
            status.children('.text').removeClass('running')
            status.children('.text').addClass('free')
        }
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
                // If the number of passengers is out of the max carried, ignore
                if (this.carried >= MAX_CARRIED) return
                // If elevator's direction as same as task's direction, it means this elevator will stop and receive passengers
                if (this.existInDirection()) {
                    this.direction === task.direction && task.cb(task, this)
                } else {
                    task.cb(task, this)
                }
            }
        })
    }

    private run() {
        this.running = true
        this.setFloorElement()
        let timer = setInterval(() => {
            this.handleTask()
            this.setDirection()
            if (this.tasks.noTask()) {
                clearInterval(timer)
                this.running = false
            } else {
                this.direction === DIRECTION.UP ? this.floor ++ : this.floor --
            }
            this.setFloorElement()
        }, EACH_FLOOR_SPEND)
    }
}
