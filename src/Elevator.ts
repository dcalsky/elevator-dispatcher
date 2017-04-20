/**
 * Created by Dcalsky on 2017/4/20.
 */

enum DIRECTION {
    UP = 1,
    DOWN = 0
}

const MAX_CARRIED = 20


class Task implements Task {
    public floor: number
    passengers: Array<Person> = []
    constructor(f: number, ps: Person) {
        this.floor = f
        this.passengers.push(ps)
    }
}



class Elevator {
    public direction: DIRECTION = DIRECTION.UP
    public floor: number = 1
    public carried: number = 0
    private passengers: Array<Person> = []
    private tasks: Array<Task> = []


    //todo: More simple way
    private getTaskByFloor(floor: number): Task {
        for (let i = 0; i < this.tasks.length; ++i) {
            if (this.tasks[i].floor === floor) {
                return this.tasks[i]
            }
        }
    }
    public addPassenger(newPassengers: Array<Person>): boolean {
        if (this.carried >= MAX_CARRIED) return false
        this.carried += 1
        newPassengers.forEach((passenger) => {
            let task = this.getTaskByFloor(passenger.destination)
            if (task) {
                task.passengers.push(passenger)
            } else {
                this.tasks.push(new Task(passenger.destination, passenger))
            }
        })
    }

    public addTask(task: Task) {
        this.tasks.push(task)
    }

    public deboard() {

    }

    private run() {

    }
}