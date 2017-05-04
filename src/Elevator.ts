/**
 * Created by Dcalsky on 2017/4/20.
 */

import * as $ from 'jquery'
import Person from './Person'
import {createPassenger} from './Element'

export enum DIRECTION {
    UP = 1,
    DOWN = 0
}

export enum TaskType {
    GET = 1,
    SEND = 2,
}

const EACH_FLOOR_SPEND = 500
const MAX_CARRIED = 20

export class Elevator {
    public direction: DIRECTION = DIRECTION.UP
    public floor: number = 1
    public carried: number = 0
    public running: boolean = false
    private passengers: Array<Person> = []
    private tasks: Array<TaskType[]> = []
    private el: JQuery
    private maxFloor: number
    private cbs: Array<Function> = []

    constructor(el: JQuery, maxFloor: number) {
        this.el = el
        this.el.children('.floors').click(this.floorClickHandle.bind(this))
        this.maxFloor = maxFloor
        this.setFloorElement()
    }
    public addPassenger(newPassengers: Array<Person>): void {
        this.carried += 1
        this.passengers = this.passengers.concat(newPassengers)
        newPassengers.forEach((p: Person) => {
            let passengers = this.el.find('.passengers')
            let pElement = createPassenger()
            passengers.append(pElement)
            this.addTask(p.destination, null, TaskType.SEND)
            this.cbs[p.floor] = null
        })
    }
    private floorClickHandle(event) {
        let floor = $(event.target)
        let id = parseInt(floor.data('id'))
        if (id !== this.floor) {
            floor.addClass('active')
            this.addTask(floor.data('id'), null, TaskType.SEND)
        }
    }
    private floorLightHandle(floor: number, on: boolean) {
        let light = this.el.find('.floors').children().filter(`[data-id="${floor}"]`)
        on ? light.addClass('active') : light.removeClass('active')
    }

    public addTask (floor: number, cb: Function = null, type: TaskType): void {
        if (!this.tasks[floor]) this.tasks[floor] = []
        this.tasks[floor].push(type)
        this.cbs[floor] = cb
        type === TaskType.SEND && this.floorLightHandle(floor, true)
        if (!this.running) this.run()
    }
    public removeTask (floor: number, type: TaskType): void {
        if (!this.tasks[floor]) this.tasks[floor] = []
        this.tasks[floor] = this.tasks[floor].filter((type) => {
            return type !== type
        })
    }
    private deboard(): void {
        let len = 0
        this.passengers = this.passengers.filter((p) => {
            if (p.destination !== this.floor) {
                return true
            } else {
                ++len
                return false
            }
        })
        this.el.find('.passengers').children().slice(0, len).remove()
        this.floorLightHandle(this.floor, false)
        this.removeTask(this.floor, TaskType.SEND)
        this.cbs[this.floor] = null
    }
    private noTask () : boolean {
        for (let i = 1; i < this.tasks.length; ++i) {
            if (this.tasks[i] && this.tasks[i].length > 0) {
                return false
            }
        }
        return true
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
    private getDirection(): DIRECTION {
        if (this.direction === DIRECTION.UP) {
            for (let i = this.floor; i <= this.maxFloor; ++i) {
                if (this.tasks[i] && this.tasks[i].length > 0) {
                    return DIRECTION.UP
                }
            }
            return DIRECTION.DOWN
        } else {
            for (let i = this.floor; i > 0; --i) {
                if (this.tasks[i]  && this.tasks[i].length > 0) {
                    return DIRECTION.DOWN
                }
            }
            return DIRECTION.UP
        }
    }
    private run() {
        this.running = true
        this.setFloorElement()
        let timer = setInterval(() => {
            this.direction = this.getDirection()
            let cb = this.cbs[this.floor]
            if (this.tasks[this.floor] && this.tasks[this.floor].indexOf(TaskType.SEND) !== -1) {
                this.deboard()
            }
            if (cb) {
                cb(this.floor, this.direction, this)
                this.direction = this.getDirection()
            }
            if (this.noTask()) {
                clearInterval(timer)
                this.running = false
                this.setFloorElement()
            } else {
                this.direction === DIRECTION.UP ? this.floor ++ : this.floor --
            }

            this.setFloorElement()
        }, EACH_FLOOR_SPEND)
    }
}
