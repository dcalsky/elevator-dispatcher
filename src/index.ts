import Dispatcher from './Dispatcher'
import Person from './Person'
import {createPassenger} from './Element'
import * as $ from 'jquery'

const container = document.getElementById('container')
const totalFloor = 20
const totalElevator = 5
const passengerCreateTime = 300
const intellij = document.getElementById('intellij')
const manual = document.getElementById('manual')
const controller = $('.controller')
const queue = $('.queue')
let autoLock = false

function randomFloor (start: number, dest: number, except?: Array<number>): number {
    const floor = Math.floor(Math.random() * (dest  - start) + start) + 1
    if (except && except.indexOf(floor) !== -1) {
        return randomFloor(start, dest, except)
    }
    return floor
}

function addPassenger(start, dest) {
    const p = createPassenger()
    const person = new Person('name', start, dest)
    console.log(person)
    dispatcher.dispatchPassengerToQueue(person)
    queue.append(p)
}

function addPsRandom() {
    const currentFloor = randomFloor(1, totalFloor)
    const destFloor = randomFloor(1, totalFloor, [currentFloor])
    addPassenger(currentFloor, destFloor)
}

// Initialize elevator dispatcher
const dispatcher = new Dispatcher(totalElevator, totalFloor, container)
// Initialize passengers system
let intellijInterval
intellij.addEventListener('click', () => {
    if (autoLock) return
    autoLock = true
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
    autoLock = false
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
