// Register all kinds in dependency order
enyo.kind({
    name: 'Gem',
    kind: 'enyo.Control',
    classes: 'gem',
    
    published: {
        gemType: '',
        row: 0,
        col: 0,
        selected: false
    },
    
    events: {
        onGemSelect: ''
    },
    
    handlers: {
        ontap: 'handleTap'
    },
    
    create: function() {
        this.inherited(arguments);
        this.addClass(this.gemType);
        console.log('Gem created:', {
            row: this.row,
            col: this.col,
            type: this.gemType
        });
    },
    
    handleTap: function(inSender, inEvent) {
        console.log('Gem tapped:', {
            row: this.row,
            col: this.col,
            type: this.gemType,
            selected: this.selected,
            event: inEvent
        });
        
        // Bubble the event up
        this.bubble('onGemSelect', {gem: this});
        return true;
    },
    
    gemTypeChanged: function(oldValue) {
        console.log('Gem type changed:', {
            row: this.row,
            col: this.col,
            oldType: oldValue,
            newType: this.gemType
        });
        this.removeClass(oldValue);
        this.addClass(this.gemType);
    },
    
    selectedChanged: function() {
        console.log('Gem selection changed:', {
            row: this.row,
            col: this.col,
            selected: this.selected
        });
        this.addRemoveClass('selected', this.selected);
    },
    
    playMatchAnimation: function() {
        console.log('Playing match animation:', {
            row: this.row,
            col: this.col
        });
        this.addClass('matching');
        enyo.asyncMethod(this, function() {
            this.removeClass('matching');
        }, 500);
    },
    
    startSwapAnimation: function() {
        console.log('Starting swap animation:', {
            row: this.row,
            col: this.col
        });
        this.addClass('swapping');
    },
    
    endSwapAnimation: function() {
        console.log('Ending swap animation:', {
            row: this.row,
            col: this.col
        });
        this.removeClass('swapping');
    },
    
    startFallAnimation: function() {
        console.log('Starting fall animation:', {
            row: this.row,
            col: this.col
        });
        this.addClass('falling');
        enyo.asyncMethod(this, function() {
            this.removeClass('falling');
        }, 500);
    }
});

enyo.kind({
    name: 'Grid',
    kind: 'enyo.Control',
    classes: 'grid game-grid',
    
    published: {
        gridSize: 8,
        gemTypes: ['red', 'blue', 'green', 'yellow', 'purple']
    },
    
    events: {
        onScoreUpdate: ''
    },
    
    components: [
        {name: 'gridContainer', classes: 'grid-container'}
    ],
    
    handlers: {
        onGemSelect: 'handleGemSelect'
    },
    
    create: function() {
        this.inherited(arguments);
        console.log('Grid created');
        this.selectedGem = null;
        this.grid = [];
        this.createGrid();
        this.checkAndHandleMatches();
    },
    
    createGrid: function() {
        console.log('Creating grid');
        this.$.gridContainer.destroyClientControls();
        this.grid = [];
        
        for (var row = 0; row < this.gridSize; row++) {
            var rowControl = this.$.gridContainer.createComponent({
                kind: 'enyo.Control',
                classes: 'grid-row'
            });
            this.grid[row] = [];
            
            for (var col = 0; col < this.gridSize; col++) {
                var gemType = this.getRandomGemType();
                var gem = rowControl.createComponent({
                    kind: 'Gem',
                    row: row,
                    col: col,
                    gemType: gemType
                });
                this.grid[row][col] = gem;
            }
        }
        console.log('Grid created with dimensions:', {
            rows: this.gridSize,
            cols: this.gridSize
        });
    },
    
    getRandomGemType: function() {
        return this.gemTypes[Math.floor(Math.random() * this.gemTypes.length)];
    },
    
    handleGemSelect: function(inSender, inEvent) {
        console.log('Grid received gem select:', {
            event: inEvent,
            sender: inSender,
            selectedGem: this.selectedGem ? {
                row: this.selectedGem.row,
                col: this.selectedGem.col
            } : null
        });
        
        if (!inEvent || !inEvent.gem) {
            console.error('Invalid gem select event:', inEvent);
            return;
        }
        
        var gem = inEvent.gem;
        
        if (!this.selectedGem) {
            console.log('First gem selected');
            this.selectedGem = gem;
            gem.setSelected(true);
        } else {
            console.log('Second gem selected');
            var firstGem = this.selectedGem;
            var secondGem = gem;
            
            if (this.areAdjacent(firstGem, secondGem)) {
                console.log('Gems are adjacent, attempting swap');
                this.swapGems(firstGem, secondGem);
                
                var matches = this.checkForMatches();
                console.log('Matches found:', matches.length);
                if (matches.length === 0) {
                    console.log('No matches, swapping back');
                    enyo.asyncMethod(this, function() {
                        this.swapGems(firstGem, secondGem);
                    }, 300);
                } else {
                    console.log('Matches found, handling matches');
                    this.handleMatches(matches);
                }
            } else {
                console.log('Gems are not adjacent');
            }
            
            firstGem.setSelected(false);
            this.selectedGem = null;
        }
    },
    
    areAdjacent: function(gem1, gem2) {
        var rowDiff = Math.abs(gem1.row - gem2.row);
        var colDiff = Math.abs(gem1.col - gem2.col);
        var isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        console.log('Checking adjacency:', {
            gem1: {row: gem1.row, col: gem1.col},
            gem2: {row: gem2.row, col: gem2.col},
            isAdjacent: isAdjacent
        });
        return isAdjacent;
    },
    
    swapGems: function(gem1, gem2) {
        console.log('Swapping gems:', {
            gem1: {row: gem1.row, col: gem1.col, type: gem1.gemType},
            gem2: {row: gem2.row, col: gem2.col, type: gem2.gemType}
        });
        
        gem1.startSwapAnimation();
        gem2.startSwapAnimation();
        
        var tempType = gem1.gemType;
        gem1.setGemType(gem2.gemType);
        gem2.setGemType(tempType);
        
        this.grid[gem1.row][gem1.col] = gem1;
        this.grid[gem2.row][gem2.col] = gem2;
        
        enyo.asyncMethod(this, function() {
            gem1.endSwapAnimation();
            gem2.endSwapAnimation();
        }, 300);
    },
    
    checkForMatches: function() {
        console.log('Checking for matches');
        var matches = [];
        
        // Check horizontal matches
        for (var row = 0; row < this.gridSize; row++) {
            for (var col = 0; col < this.gridSize - 2; col++) {
                var gem1 = this.grid[row][col];
                var gem2 = this.grid[row][col + 1];
                var gem3 = this.grid[row][col + 2];
                
                if (gem1.gemType === gem2.gemType && gem2.gemType === gem3.gemType) {
                    if (matches.indexOf(gem1) === -1) matches.push(gem1);
                    if (matches.indexOf(gem2) === -1) matches.push(gem2);
                    if (matches.indexOf(gem3) === -1) matches.push(gem3);
                    
                    var nextCol = col + 3;
                    while (nextCol < this.gridSize && this.grid[row][nextCol].gemType === gem1.gemType) {
                        var nextGem = this.grid[row][nextCol];
                        if (matches.indexOf(nextGem) === -1) matches.push(nextGem);
                        nextCol++;
                    }
                }
            }
        }
        
        // Check vertical matches
        for (var col = 0; col < this.gridSize; col++) {
            for (var row = 0; row < this.gridSize - 2; row++) {
                var gem1 = this.grid[row][col];
                var gem2 = this.grid[row + 1][col];
                var gem3 = this.grid[row + 2][col];
                
                if (gem1.gemType === gem2.gemType && gem2.gemType === gem3.gemType) {
                    if (matches.indexOf(gem1) === -1) matches.push(gem1);
                    if (matches.indexOf(gem2) === -1) matches.push(gem2);
                    if (matches.indexOf(gem3) === -1) matches.push(gem3);
                    
                    var nextRow = row + 3;
                    while (nextRow < this.gridSize && this.grid[nextRow][col].gemType === gem1.gemType) {
                        var nextGem = this.grid[nextRow][col];
                        if (matches.indexOf(nextGem) === -1) matches.push(nextGem);
                        nextRow++;
                    }
                }
            }
        }
        
        console.log('Matches found:', matches.length);
        return matches;
    },
    
    handleMatches: function(matches) {
        console.log('Handling matches:', matches.length);
        matches.forEach(function(gem) {
            gem.playMatchAnimation();
        });
        
        this.doScoreUpdate({
            matches: matches
        });
        
        matches.forEach(function(gem) {
            gem.setGemType(this.getRandomGemType());
            gem.startFallAnimation();
        }, this);
        
        enyo.asyncMethod(this, function() {
            var newMatches = this.checkForMatches();
            if (newMatches.length > 0) {
                this.handleMatches(newMatches);
            }
        }, 600);
    },
    
    checkAndHandleMatches: function() {
        console.log('Checking initial matches');
        var matches = this.checkForMatches();
        if (matches.length > 0) {
            this.handleMatches(matches);
        }
    }
});

enyo.kind({
    name: 'GameBoard',
    kind: 'enyo.Control',
    classes: 'game-board',
    
    components: [
        {name: 'grid', kind: 'Grid', onScoreUpdate: 'handleScoreUpdate'},
        {name: 'score', kind: 'enyo.Control', classes: 'score-display', content: 'Score: 0'}
    ],
    
    create: function() {
        this.inherited(arguments);
        console.log('GameBoard created');
        this.score = 0;
    },
    
    handleScoreUpdate: function(inSender, inEvent) {
        console.log('Score update received:', inEvent);
        if (inEvent && inEvent.matches) {
            this.score += inEvent.matches.length * 10;
            if (this.$.score) {
                this.$.score.setContent('Score: ' + this.score);
            }
        }
    }
}); 