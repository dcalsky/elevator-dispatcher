/**
 * Created by Dcalsky on 2017/4/24.
 */

import * as $ from 'jquery'

const Elevator_Space = 50
const Floor_Height = 40
const Elevator_Class = 'elevator'
const Queue_Class = 'queue'
const Building_Class = 'building'

let elevatorTemplate = `
          <div class="close"></div>
          <div class="status">
            <h2 class="floor"></h2>
            <p class="text"></p>
          </div>
          <ul class="floors">
            <li data-id="1">1</li>
            <li data-id="2">2</li>
            <li data-id="3">3</li>
            <li data-id="4">4</li>
            <li data-id="5">5</li>
            <li data-id="6">6</li>
            <li data-id="7">7</li>
            <li data-id="8">8</li>
            <li data-id="9">9</li>
            <li data-id="10">10</li>
            <li data-id="11">11</li>
            <li data-id="12">12</li>
            <li data-id="13">13</li>
            <li data-id="14">14</li>
            <li data-id="15">15</li>
            <li data-id="16">16</li>
            <li data-id="17">17</li>
            <li data-id="18">18</li>
            <li data-id="19">19</li>
            <li data-id="20">20</li>
          </ul>
          <div class="space">
            <h3>Passengers</h3>
            <ul class="passengers">
            </ul>
          </div>
`

const peopleTemplate = `
              <li class="iconfont icon-people people"></li>
`

export function createElevator() {
    let el = $('<div></div>')
    el.addClass(Elevator_Class)
    el.html(elevatorTemplate)
    return el
}

export function createPassenger() {
    let el = $('<li></li>')
    el.addClass('iconfont')
    el.addClass('icon-people')
    el.addClass('people')
    return el
}