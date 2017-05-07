/**
 * Created by Dcalsky on 2017/5/6.
 */
import {ArrivedCallback} from './Elevator'

export enum DIRECTION {
    UP = 1,
    DOWN = 0
}

export enum TaskType {
    GET = 1,
    SEND = 2,
}

export class Task {
    public floor: number
    public type: TaskType
    public cb: ArrivedCallback
    public direction: DIRECTION
    constructor(floor: number, type: TaskType, direction: DIRECTION, cb?: ArrivedCallback) {
        this.floor = floor
        this.type = type
        this.direction = direction
        this.cb = cb ? cb : null
    }
}

export class TaskQueue {
    public tasks: Array<Task[]> = []
    public length: number = 0
    public getTasksByFloor(floor: number): Array<Task> {
        if (!this.tasks[floor]) return []
        return this.tasks[floor]
    }
    constructor() {

    }
    public getTasksByType(type: TaskType, floor?: number): Array<Task> {
        if (floor) {
            if (!this.tasks[floor]) return []
            return this.tasks[floor].filter(task => task.type === type)
        } else {
            let tasks: Array<Task>
            this.tasks.forEach(floorTasks => {
                tasks = tasks.concat(floorTasks.filter(task => task.type === type))
            })
            return tasks
        }
    }
    // If true, return the index of that task, else return -1
    public existTask(task: Task): number {
        let floorTasks = this.getTasksByFloor(task.floor)
        for (let i = 0; i < floorTasks.length; ++i) {
            if (floorTasks[i].type === task.type && floorTasks[i].direction === task.direction) {
                return i
            }
        }
        return -1
    }
    public addTask (task: Task): boolean {
        if (this.existTask(task) === -1) {
            this.length ++
            !this.tasks[task.floor] && (this.tasks[task.floor] = [])
            this.tasks[task.floor].push(task)
            return true
        } else {
            return false
        }
    }
    public removeTask(task: Task): void {
        let index = this.existTask(task)
        if (index !== -1) {
            this.getTasksByFloor(task.floor).splice(index, 1)
        }
    }
    public noTask(): boolean {
        for (let i = 1; i < this.tasks.length; ++i) {
            if (this.tasks[i] && this.tasks[i].length > 0) {
                return false
            }
        }
        return true
    }
}
