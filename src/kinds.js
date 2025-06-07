// Register all kinds in dependency order
enyo.kind({
    name: 'Gem',
    kind: enyo.Control,
    classes: 'gem',
    
    published: {
        gemType: '',
        row: 0,
        col: 0,
        selected: false
    },
    
    create: function() {
        this.inherited(arguments);
        this.addClass(this.gemType);
    },
    
    gemTypeChanged: function(oldValue) {
        this.removeClass(oldValue);
        this.addClass(this.gemType);
    },
    
    selectedChanged: function() {
        this.addRemoveClass('selected', this.selected);
    },
    
    playMatchAnimation: function() {
        this.addClass('matching');
        setTimeout(function() {
            this.removeClass('matching');
        }.bind(this), 500);
    }
});

enyo.kind({
    name: 'Grid',
    kind: enyo.Control,
    classes: 'grid',
    
    published: {
        gridSize: 8,
        gemTypes: ['red', 'blue', 'green', 'yellow', 'purple']
    },
    
    events: {
        onScoreUpdate: ''
    },
    
    create: function() {
        this.inherited(arguments);
        this.createGrid();
        this.selectedGem = null;
        // Check for initial matches
        this.checkAndHandleMatches();
    },
    
    createGrid: function() {
        this.destroyClientControls();
        this.grid = [];
        
        for (var row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (var col = 0; col < this.gridSize; col++) {
                var gemType = this.getRandomGemType();
                var gem = this.createComponent({
                    kind: 'Gem',
                    row: row,
                    col: col,
                    gemType: gemType,
                    classes: 'gem ' + gemType,
                    ontap: 'handleGemTap'
                });
                this.grid[row][col] = gem;
            }
        }
    },
    
    getRandomGemType: function() {
        return this.gemTypes[Math.floor(Math.random() * this.gemTypes.length)];
    },
    
    handleGemTap: function(inSender, inEvent) {
        if (!this.selectedGem) {
            // First selection
            this.selectedGem = inSender;
            inSender.setSelected(true);
        } else {
            // Second selection
            var firstGem = this.selectedGem;
            var secondGem = inSender;
            
            // Check if gems are adjacent
            if (this.areAdjacent(firstGem, secondGem)) {
                // Swap gems
                this.swapGems(firstGem, secondGem);
                
                // Check for matches
                var matches = this.checkForMatches();
                if (matches.length === 0) {
                    // If no matches, swap back after a delay
                    setTimeout(function() {
                        this.swapGems(firstGem, secondGem);
                    }.bind(this), 300);
                } else {
                    // Handle matches and cascading effects
                    this.handleMatches(matches);
                }
            }
            
            // Reset selection
            firstGem.setSelected(false);
            this.selectedGem = null;
        }
    },
    
    areAdjacent: function(gem1, gem2) {
        var rowDiff = Math.abs(gem1.row - gem2.row);
        var colDiff = Math.abs(gem1.col - gem2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    },
    
    swapGems: function(gem1, gem2) {
        // Swap gem types
        var tempType = gem1.gemType;
        gem1.setGemType(gem2.gemType);
        gem2.setGemType(tempType);
        
        // Update grid array
        this.grid[gem1.row][gem1.col] = gem1;
        this.grid[gem2.row][gem2.col] = gem2;
    },
    
    checkForMatches: function() {
        var matches = new Set(); // Use Set to avoid duplicate matches
        
        // Check horizontal matches
        for (var row = 0; row < this.gridSize; row++) {
            for (var col = 0; col < this.gridSize - 2; col++) {
                var gem1 = this.grid[row][col];
                var gem2 = this.grid[row][col + 1];
                var gem3 = this.grid[row][col + 2];
                
                if (gem1.gemType === gem2.gemType && gem2.gemType === gem3.gemType) {
                    matches.add(gem1);
                    matches.add(gem2);
                    matches.add(gem3);
                    
                    // Check for longer matches
                    var nextCol = col + 3;
                    while (nextCol < this.gridSize && this.grid[row][nextCol].gemType === gem1.gemType) {
                        matches.add(this.grid[row][nextCol]);
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
                    matches.add(gem1);
                    matches.add(gem2);
                    matches.add(gem3);
                    
                    // Check for longer matches
                    var nextRow = row + 3;
                    while (nextRow < this.gridSize && this.grid[nextRow][col].gemType === gem1.gemType) {
                        matches.add(this.grid[nextRow][col]);
                        nextRow++;
                    }
                }
            }
        }
        
        return Array.from(matches);
    },
    
    handleMatches: function(matches) {
        // Play match animation for matched gems
        matches.forEach(function(gem) {
            gem.playMatchAnimation();
        });
        
        // Update score
        this.doScoreUpdate({
            matches: matches
        });
        
        // Replace matched gems with new ones
        matches.forEach(function(gem) {
            gem.setGemType(this.getRandomGemType());
        }, this);
        
        // Check for new matches after a delay
        setTimeout(function() {
            var newMatches = this.checkForMatches();
            if (newMatches.length > 0) {
                this.handleMatches(newMatches);
            }
        }.bind(this), 600);
    },
    
    checkAndHandleMatches: function() {
        var matches = this.checkForMatches();
        if (matches.length > 0) {
            this.handleMatches(matches);
        }
    }
});

enyo.kind({
    name: 'GameBoard',
    kind: enyo.Control,
    classes: 'game-board',
    
    // Game configuration
    gridSize: 8,
    gemTypes: ['red', 'blue', 'green', 'yellow', 'purple'],
    
    components: [
        {
            name: 'grid',
            kind: 'Grid',
            classes: 'game-grid',
            gridSize: 8,
            gemTypes: ['red', 'blue', 'green', 'yellow', 'purple'],
            onScoreUpdate: 'handleScoreUpdate'
        },
        {
            name: 'score',
            kind: enyo.Control,
            content: 'Score: 0',
            classes: 'score-display'
        }
    ],
    
    create: function() {
        this.inherited(arguments);
        this.score = 0;
    },
    
    rendered: function() {
        this.inherited(arguments);
        this.updateScoreDisplay();
    },
    
    updateScoreDisplay: function() {
        if (this.$.score) {
            this.$.score.setContent('Score: ' + this.score);
        }
    },
    
    handleScoreUpdate: function(inSender, inEvent) {
        // Update score when matches are found
        if (inEvent.matches) {
            this.score += inEvent.matches.length * 10;
            this.updateScoreDisplay();
        }
    }
}); 