"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
var Side = /** @class */ (function () {
    function Side() {
        this.slots = [4, 4, 4, 4, 4, 4];
        this.house = 0;
    }
    Side.prototype.clone = function () {
        var result = new Side();
        result.house = this.house;
        for (var i = 0; i < 6; i++) {
            result.slots[i] = this.slots[i];
        }
        return result;
    };
    Side.prototype.isEmpty = function () {
        return !this.slots.some(function (value) { return value > 0; });
    };
    Side.prototype.print = function () {
        console.log("(   ) [".concat(this.slots.join(']['), "]} (").concat(this.house.toString().padStart(3, ' '), ")]"));
    };
    Side.prototype.printReverse = function () {
        var tempSlots = __spreadArray([], this.slots, true);
        console.log("(".concat(this.house.toString().padStart(3, ' '), ") [").concat(tempSlots.reverse().join(']['), "]} (   )]"));
    };
    return Side;
}());
var Board = /** @class */ (function () {
    function Board() {
        this.player1Side = new Side();
        this.player2Side = new Side();
    }
    Board.prototype.print = function () {
        this.player1Side.print();
        this.player2Side.printReverse();
    };
    return Board;
}());
exports.Board = Board;
