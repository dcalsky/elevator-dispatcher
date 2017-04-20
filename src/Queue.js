/**
 * Created by Dcalsky on 2017/4/20.
 */
var Queue = (function () {
    function Queue(f, statusHook) {
        this.passengers = [];
        this.floor = f;
        this.statusTrigger = statusHook;
    }
    Queue.prototype.addPassenger = function (person) {
        this.passengers.push(person);
        this.changeStatus(person.destination);
    };
    Queue.prototype.board = function (num, elevatorDirection) {
        if (num === void 0) { num = 0; }
        this.passengers.filter(function (passenger) {
            return passenger.destination !== elevatorDirection;
        });
        this.changeStatus();
    };
    Queue.prototype.changeStatus = function (direction) {
        this.directionStatus.up = this.directionStatus.up | direction;
        this.statusTrigger(this); //todo too many properties
    };
    return Queue;
}());
//# sourceMappingURL=queue.js.map