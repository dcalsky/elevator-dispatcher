/**
 * Created by Dcalsky on 2017/4/20.
 */

enum DIRECTION {
    UP = 1,
    DOWN = 0
}

const MAX_CARRIED = 20

interface Task {
    floor: number
}

class Elevator {
    public direction: DIRECTION = DIRECTION.UP
    public floor: number = 1
    public carried: number = 0
    private passengers: Array<Person> = []

    private tasks: Array<Task> = []

    public addPassenger(people: Array<Person>): boolean {
        if (this.carried >= MAX_CARRIED) return false
        this.carried += 1

    }

    public addTask(task: Task) {
        this.tasks.push(task)
    }

    public deboard() {

    }

    private run() {

    }
}