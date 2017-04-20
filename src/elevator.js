/**
 * Created by Dcalsky on 2017/4/20.
 */
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["UP"] = 1] = "UP";
    DIRECTION[DIRECTION["DOWN"] = 0] = "DOWN";
})(DIRECTION || (DIRECTION = {}));
var MAX_CARRIED = 20;
var Elevator = (function () {
    function Elevator() {
        this.direction = DIRECTION.UP;
        this.floor = 1;
        this.carried = 0;
        this.passengers = [];
        this.tasks = [];
    }
    Elevator.prototype.addPassenger = function (people) {
        if (this.carried >= MAX_CARRIED)
            return false;
        this.carried += 1;
    };
    Elevator.prototype.addTask = function (task) {
        this.tasks.push(task);
    };
    Elevator.prototype.deboard = function () {
    };
    Elevator.prototype.run = function () {
    };
    return Elevator;
}());
//# sourceMappingURL=elevator.js.map