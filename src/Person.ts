/**
 * Created by Dcalsky on 2017/4/20.
 */

export default class Person {
    public name: string
    public floor: number
    public destination: number

    constructor(name: string, floor: number, dest: number) {
        this.floor = floor
        this.destination = dest
        this.name = name
    }
}