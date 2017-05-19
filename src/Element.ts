/**
 * Created by Dcalsky on 2017/4/24.
 */

import * as $ from 'jquery'

const ElevatorClass = 'elevator'
const PersonClass = 'people'
const ElevatorTemplate = `
          <div class="close"></div>
          <div class="status">
            <h2 class="floor"></h2>
            <p class="text"></p>
          </div>
          <ul class="floors">
            <li data-id="1">1</li><li data-id="2">2</li><li data-id="3">3</li><li data-id="4">4</li><li data-id="5">5</li><li data-id="6">6</li><li data-id="7">7</li><li data-id="8">8</li><li data-id="9">9</li><li data-id="10">10</li><li data-id="11">11</li><li data-id="12">12</li><li data-id="13">13</li><li data-id="14">14</li><li data-id="15">15</li><li data-id="16">16</li><li data-id="17">17</li><li data-id="18">18</li><li data-id="19">19</li><li data-id="20">20</li>
          </ul>
          <div class="space">
            <h3>Passengers</h3>
            <ul class="passengers">
            </ul>
          </div>
`

export interface FloorClick {
    (floor: number): void
}

export function createPassenger(): JQuery {
    return $('<li></li>').addClass('iconfont icon-people people')
}

export function removeQueue(n: number) {
    $('.queue').children().slice(1, n).remove()
}

export class Element {
    protected el: JQuery = $('<div></div>')
    protected type: string
    protected parentContainer: HTMLElement
    constructor(t: string, parentContainer: HTMLElement, el?: JQuery) {
        this.type = t
        el && (this.el = el)
        this.parentContainer = parentContainer
        this.addClass(t)
    }
    protected addClass(classes: string) {
        this.el.addClass(classes)
    }
}

export class ElevatorElement extends Element {
    private floors: JQuery
    private status: JQuery
    private passengers: JQuery
    private floorClickCallback: FloorClick

    constructor(fc: FloorClick, parentContainer: HTMLElement) {
        super(ElevatorClass, parentContainer)
        this.floorClickCallback = fc
        this.el.html(ElevatorTemplate)
        this.floors = this.el.find('.floors')
        this.status = this.el.find('.status')
        this.passengers = this.el.find('.passengers')

        this.floors.click(this.floorClickHandle.bind(this))
        $(this.parentContainer).append(this.el)
    }

    public lightOn(floor: number, on_off: boolean) {
        const light = this.floors.children().filter(`[data-id="${floor}"]`)
        on_off ? light.addClass('active') : light.removeClass('active')
    }

    private floorClickHandle(event) {
        const id = parseInt($(event.target).data('id'))
        this.floorClickCallback(id)
    }

    public addPassenger() {
        this.passengers.append(createPassenger())
    }

    public updateStatus(floor: number, running: boolean) {
        const text = this.status.children('.text')
        this.status.children('.floor').text(`${floor}F`)
        if (running) {
            text.text('Running').removeClass('free').addClass('running')
        } else {
            text.text('Free').removeClass('running').addClass('free')
        }
    }

    public removePassengers(n: number) {
        this.passengers.children().slice(0, n).remove()
    }
}
