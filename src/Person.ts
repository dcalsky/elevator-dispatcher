/**
 * Created by Dcalsky on 2017/4/20.
 */

class Person {
    public name: string
    public floor: number
    public destination: number

    constructor(name: string, dest: number, floor: number) {
        this.floor = floor
        this.destination = dest
        this.name = name
    }
}