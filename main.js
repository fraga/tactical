var TACTICAL = (function(o) {

    var canvas

    var game = {

        ctx: null, 
        WIDTH: 0, 
        HEIGHT: 0, 
        // ROWS: 0, 
        // COLS: 0,
        TILE_SIZE: 0,
        HALF_PIXEL: 0.5,

        unselectedTile: {
            fillStyle: "rgb(255,255,255)",
            strokeStyle: "rgb(0,0,0)"

        },
        selectedTile: {
            fillStyle: "rgb(255,0,0)",
            strokeStyle: "rgb(0,0,0)"
        },
        highlightedTile: {
            fillStyle: "rgb(0,255,0)",
            strokeStyle: "rgb(0,0,0)"
        },

        EventTypeEnum: Object.freeze({
            CLICK: 1, 
            MOVE: 2
        }),

        // map: [
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        // ],

        init: function(c) {

            this.ctx = canvas.getContext('2d')

            this.ctx.fillStyle = this.unselectedTile.fillStyle
            this.ctx.fillRect(0, 0, c.width, c.height)

            this.WIDTH   = c.width
            this.HEIGHT  = c.height
            // this.ROWS    = 10
            // this.COLS    = 10
            this.TILE_SIZE = 64

            var that = this

            c.onclick = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.CLICK, { x: e.offsetX, y: e.offsetY })
            }

            c.onmousemove = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.MOVE, { x: e.offsetX, y: e.offsetY })
            }

            this.draw()

        },

        isometricToCartesian2D : function(p) {
            
            return {
                x: (2 * p.y + p.x) / 2,
                y: (2 * p.y - p.x) / 2
            }

        },

        cartesian2DToIsometric: function(p) {

            return {
                x: p.x - p.y,
                y: (p.x + p.y) / 2
            }

        },

        draw: function() {

            // var currentRow = 0, currentColumn = 0
            
            // for(var i=0; i < this.map.length; i += 1) {
                
                // Next row
                // if ( currentRow != parseInt( (i / this.ROWS), 10) ) {
                //     currentRow = parseInt( (i / this.ROWS), 10)
                //     currentColumn = 0    
                // }

                // this.ctx.strokeRect(currentRow * this.TILE_SIZE, 
                //     currentColumn * this.TILE_SIZE,
                //     this.TILE_SIZE, 
                //     this.TILE_SIZE)
                
                // currentColumn += 1

            // }

            // draw vertical lines
            var i = 0,
                p = { x: 0, y: 0 }
                rows = parseInt(this.HEIGHT / this.TILE_SIZE, 10) * 2,
                cols = parseInt(this.WIDTH / this.TILE_SIZE, 10) * 2

            while(i <= cols) {

                p = this.cartesian2DToIsometric({ x: i * this.TILE_SIZE + this.HALF_PIXEL, y: 0 })
                this.ctx.moveTo(p.x, p.y)

                p = this.cartesian2DToIsometric({ x: i * this.TILE_SIZE + this.HALF_PIXEL, y: rows * this.TILE_SIZE })
                this.ctx.lineTo(p.x, p.y)

                i += 1

            }

            // draw horizontal lines
            i = 0
            while(i <= rows) {

                p = this.cartesian2DToIsometric({ x: 0, y: i * this.TILE_SIZE + this.HALF_PIXEL })
                this.ctx.moveTo(p.x, p.y)

                p = this.cartesian2DToIsometric({ x: cols * this.TILE_SIZE, y: i * this.TILE_SIZE + this.HALF_PIXEL } )
                this.ctx.lineTo(p.x, p.y)
                
                i += 1

            }

            this.ctx.stroke()

        },

        drawTile: function(row, col, fillStyle, strokeStyle) {

            this.ctx.fillStyle = fillStyle
            this.ctx.fillRect(row * this.TILE_SIZE + 1,
                col * this.TILE_SIZE + 1,
                this.TILE_SIZE - 1,
                this.TILE_SIZE - 1)
            
            this.ctx.strokeStyle = strokeStyle
            this.ctx.strokeRect(row * this.TILE_SIZE + this.HALF_PIXEL,
                col * this.TILE_SIZE + this.HALF_PIXEL,
                this.TILE_SIZE,
                this.TILE_SIZE)

        },

        selectTile: function(e) {

            var p = this.cartesian2DToIsometric({ x: e.x, y: e.y })
            var row = parseInt(p.x / this.TILE_SIZE, 10), 
                col = parseInt(p.y / this.TILE_SIZE, 10)

            console.log('selectedTile: ' + row + ', ' + col)

            if(typeof this.selectedTile.row === "number") {

                this.drawTile(this.selectedTile.row, this.selectedTile.col, 
                    this.unselectedTile.fillStyle, this.unselectedTile.strokeStyle)

            }

            this.selectedTile.row = row
            this.selectedTile.col = col

            this.highlightedTile.row = null
            this.highlightedTile.col = null

            this.drawTile(this.selectedTile.row, this.selectedTile.col, 
                this.selectedTile.fillStyle, this.selectedTile.strokeStyle)
        
        },

        highlightTile: function(e) {

            var p = this.cartesian2DToIsometric({ x: e.x, y: e.y })
            var row = parseInt(p.x / this.TILE_SIZE, 10), 
                col = parseInt(p.y / this.TILE_SIZE, 10)

            console.log('highlightedTile: ' + row + ', ' + col)

            if(typeof this.highlightedTile.row === "number") {

                this.drawTile(this.highlightedTile.row, this.highlightedTile.col, 
                    this.unselectedTile.fillStyle, this.unselectedTile.strokeStyle)

            }

            if(typeof this.selectedTile.row === "number" &&
                row === this.selectedTile.row && col === this.selectedTile.col) {
                return;
            }

            this.highlightedTile.row = row
            this.highlightedTile.col = col

            this.drawTile(this.highlightedTile.row, this.highlightedTile.col, 
                this.highlightedTile.fillStyle, this.highlightedTile.strokeStyle)
        },

        handleEvent: function(type, e) {

            switch(type) {
                
                case this.EventTypeEnum.CLICK:
                    this.selectTile(e)
                    break;

                case this.EventTypeEnum.MOVE:
                    this.highlightTile(e)
                    break;
                
                default:
                    break;
            }

        }

    }


    var init = function() {
        
        canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        canvas.id = 'canvas2d'

        if(document.getElementById('canvas2d') == null) {
            document.body.appendChild(canvas)

            game.init(canvas)
        }

    }

    
    init()

    return o

}(TACTICAL || {}))