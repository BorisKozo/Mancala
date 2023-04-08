"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var board_1 = require("./board");
var Player;
(function (Player) {
    Player[Player["One"] = 0] = "One";
    Player[Player["Two"] = 1] = "Two";
})(Player || (Player = {}));
var Game = /** @class */ (function () {
    function Game() {
        this.board = new board_1.Board();
        this.currentPlayer = Player.One;
    }
    Game.prototype.print = function () {
        this.board.print();
    };
    return Game;
}());
exports.Game = Game;
