enyo.kind({
    name: 'App',
    kind: enyo.Control,
    classes: 'app',
    components: [
        {
            name: 'debug',
            kind: enyo.Control,
            content: 'Initializing...',
            classes: 'debug-info'
        },
        {
            name: 'gameBoard',
            kind: 'GameBoard',
            classes: 'game-board'
        }
    ],
    create: function() {
        this.inherited(arguments);
        this.$.debug.setContent('App created');
    },
    rendered: function() {
        this.inherited(arguments);
        this.$.debug.setContent('App rendered');
    }
}); 