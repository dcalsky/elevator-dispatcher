import Dispatcher from './Dispatcher'
import Person from './Person'
import {createPassenger} from './Element'
import * as $ from 'jquery'

const container = document.getElementById('container')
const totalFloor = 20
const totalElevator = 1
const passengerCreateTime = 300
const intellij = document.getElementById('intellij')
const manual = document.getElementById('manual')
const controller = $('.controller')
const queue = $('.queue')

function randomFloor (start: number, dest: number, except?: Array<number>): number {
    let floor = Math.floor(Math.random() * (dest  - start) + start) + 1
    if (except && except.indexOf(floor) !== -1) {
        return randomFloor(start, dest, except)
    }
    return floor
}

function addPassenger(start, dest) {
    let p = createPassenger(),
        person = new Person('name', start, dest)
    console.log(person)
    dispatcher.dispatchPassengerToQueue(person)
    queue.append(p)
}

function addPsRandom() {
    let currentFloor = randomFloor(1, totalFloor),
        destFloor = randomFloor(1, totalFloor, [currentFloor])
    addPassenger(currentFloor, destFloor)
}

// Initialize elevator dispatcher
let dispatcher = new Dispatcher(totalElevator, totalFloor, container)
// Initialize passengers system
let intellijInterval
intellij.addEventListener('click', () => {
    addPsRandom()
    intellijInterval = setInterval(addPsRandom, passengerCreateTime)
    intellij.classList.add('mode-active')
    manual.classList.remove('mode-active')
    controller.hide()
})

manual.addEventListener('click', () => {
    clearInterval(intellijInterval)
    controller.show()
    intellij.classList.remove('mode-active')
    manual.classList.add('mode-active')
})

$('#add').click(() => {
    const floor = parseInt($('#current-floor').val())
    const dest = parseInt($('#dest').val())
    if (floor <= 0 || dest <= 0 || !floor || !dest || floor === dest || floor > totalFloor || dest > totalFloor) {
        alert('不合法的楼层！')
        return
    }
    addPassenger(floor, dest)
})
