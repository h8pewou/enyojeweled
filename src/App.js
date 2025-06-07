enyo.kind({
    name: 'App',
    kind: enyo.Control,
    components: [
        {
            name: 'gameBoard',
            kind: 'GameBoard',
            classes: 'game-board'
        }
    ],
    create: function() {
        this.inherited(arguments);
    }
}); 