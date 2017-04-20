/**
 * Created by Dcalsky on 2017/4/20.
 */
var Dispatcher = (function () {
    function Dispatcher(elevatorNum, QueueNum) {
        this.elevators = [];
        this.queue = [];
        var statusHook = function (queue) {
        };
        for (var i = 0; i < elevatorNum; ++i) {
            this.elevators.push(new Elevator());
        }
        for (var i = 1; i <= QueueNum; ++i) {
            this.queue.push(new Queue(i), statusHook);
        }
    }
    Dispatcher.prototype.dispatchElevator = function () {
        // 距离最近 并且方向相同就给它
    };
    return Dispatcher;
}());
//# sourceMappingURL=Dispatcher.js.map