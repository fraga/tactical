var TACTICAL = (function(o) {

    var canvas
    var mm_canvas

    var game = {

        ctx: null,
        mm_ctx: null,
        WIDTH: 0,
        HEIGHT: 0, 
        ROWS: 0,
        COLS: 0,
        VIEWPORT: { },
        CENTER_X: function() {
            return this.WIDTH / 2;
        },
        CENTER_Y: function() {
            return this.HEIGHT / 2;
        },
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
        terrainTile: {
            fillStyle: "rgb(143, 120, 78)",
            strokeStyle: "rgb(0,0,0)"  
        },

        EventTypeEnum: Object.freeze({
            CLICK: 1, 
            MOVE: 2,
            LEFT: 3,
            UP: 4,
            RIGHT: 5,
            DOWN: 6
        }),

        map: {
            rows: 20,
            cols: 20,
            data: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        },

        init: function(c, mm) {

            this.ctx = c.getContext('2d')
            this.ctx.fillStyle = this.unselectedTile.fillStyle
            this.ctx.fillRect(0, 0, c.width, c.height)

            this.mm_ctx = mm.getContext('2d')
            this.mm_ctx.fillStyle = this.unselectedTile.fillStyle
            this.mm_ctx.fillRect(0, 0, mm.width, mm.height)

            this.WIDTH   = c.width
            this.HEIGHT  = c.height
            this.ROWS    = this.map.rows
            this.COLS    = this.map.cols
            this.TILE_SIZE = 32
            this.VIEWPORT = { 
                x: -(this.TILE_SIZE * this.ROWS)/2, 
                y: (this.TILE_SIZE * this.ROWS)/8, 
                minX: -(this.TILE_SIZE * this.ROWS), 
                maxX: this.TILE_SIZE * this.ROWS,
                minY: -(this.TILE_SIZE * this.ROWS),
                maxY: 0,
                width: c.width,
                height: c.height 
            }

            var that = this

            c.onclick = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.CLICK, { x: e.offsetX, y: e.offsetY })
            }

            c.onmousemove = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.MOVE, { x: e.offsetX, y: e.offsetY })
            }

            document.addEventListener('keydown', function(e) {
                switch(e.which) {
                    case 37: // LEFT
                        that.handleEvent.call(that, that.EventTypeEnum.LEFT, e)
                        break;
                    case 38: // UP
                        that.handleEvent.call(that, that.EventTypeEnum.UP, e)
                        break;
                    case 39: // RIGHT
                        that.handleEvent.call(that, that.EventTypeEnum.RIGHT, e)
                        break;
                    case 40: // DOWN
                        that.handleEvent.call(that, that.EventTypeEnum.DOWN, e)
                        break;

                    default:
                        break;
                }                
            })

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

            this.drawMap(this.ctx)
            this.drawMiniMap(this.mm_ctx)
        },

        drawMap: function(context) {
            
            var currentRow = 0, currentColumn = 0,
                style = this.unselectedTile
            for(var i=0; i < this.ROWS * this.COLS; i += 1) {

                // Next row
                if ( currentRow != parseInt( (i / this.ROWS), 10) ) {
                    currentRow = parseInt( (i / this.ROWS), 10)
                    currentColumn = 0    
                }
                style = this.getTileStyle(currentRow, currentColumn)

                this.drawIsoTile(context, currentColumn * this.TILE_SIZE,
                    currentRow * this.TILE_SIZE,
                    -(this.VIEWPORT.x),
                    -(this.VIEWPORT.y),
                    style)
                
                currentColumn += 1
            }
        },

        drawMiniMap: function(context) {

            var miniMapX = 0 + this.HALF_PIXEL,
                miniMapY = Math.floor(3 * this.HEIGHT / 4) + this.HALF_PIXEL,
                tileSize = this.TILE_SIZE / 4

            context.strokeRect(miniMapX, miniMapY, Math.floor(this.WIDTH / 4), Math.floor(this.HEIGHT / 4))

            var currentRow = 0, currentColumn = 0,
                style = this.unselectedTile
            for(var i=0; i < this.ROWS * this.COLS; i += 1) {

                // Next row
                if ( currentRow != parseInt( (i / this.ROWS), 10) ) {
                    currentRow = parseInt( (i / this.ROWS), 10)
                    currentColumn = 0    
                }

                style = this.getTileStyle(currentRow, currentColumn)

                this.drawIsoTile(context, currentColumn * tileSize,
                    currentRow * tileSize,
                    -this.VIEWPORT.x / 4,
                    -(this.VIEWPORT.y / 4) + miniMapY,
                    style,
                    tileSize)
                
                currentColumn += 1
            }
        },

        getTileStyle: function(row, col) {
            var style = this.unselectedTile
            if(this.selectedTile.row === row && this.selectedTile.col === col) {
                style = this.selectedTile
            }
            else if(this.map.data[(row * this.COLS) + col] === 1) {
                style = this.terrainTile
            }

            return style
        },

        moveViewport: function(offsetX, offsetY) {
            this.VIEWPORT.x += offsetX
            this.VIEWPORT.y += offsetY

            console.log('offsetX: ' + offsetX + ', offsetY: ' + offsetY)
            console.log('this.VIEWPORT.minX: ' + this.VIEWPORT.minX + ', this.VIEWPORT.maxX: ' + this.VIEWPORT.maxX)
            console.log('this.VIEWPORT.minY: ' + this.VIEWPORT.minY + ', this.VIEWPORT.maxY: ' + this.VIEWPORT.maxY)

            if(this.VIEWPORT.x < this.VIEWPORT.minX) {
                this.VIEWPORT.x = this.VIEWPORT.minX
            }

            if( (this.VIEWPORT.x + this.VIEWPORT.width) > this.VIEWPORT.maxX) {
                this.VIEWPORT.x = this.VIEWPORT.maxX - this.VIEWPORT.width
            }

            if(this.VIEWPORT.y < this.VIEWPORT.minY) {
                this.VIEWPORT.y = this.VIEWPORT.minY
            }

            if( (this.VIEWPORT.y - this.VIEWPORT.height) > this.VIEWPORT.maxX) {
                this.VIEWPORT.y = this.VIEWPORT.maxX
            }

            this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
            
            console.log('viewport: ' + this.VIEWPORT.x + ', ' + this.VIEWPORT.y)
            
            this.draw()
        },

        drawIsoTile: function(context, upperLeftX, upperLeftY, offsetX, offsetY, style, tileSize) {

            context.fillStyle = style.fillStyle
            context.strokeStyle = style.strokeStyle

            var x = 0,
                y = 0,
                offsetX = offsetX || 0,
                offsetY = offsetY || 0,
                size = tileSize || this.TILE_SIZE,
                points = [ 
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + size, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + size, y: upperLeftY + size }),
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY + size })
                ]

            context.beginPath()
            context.moveTo(points[0].x + offsetX, points[0].y + offsetY)
            context.lineTo(points[1].x + offsetX, points[1].y + offsetY)
            context.lineTo(points[2].x + offsetX, points[2].y + offsetY)
            context.lineTo(points[3].x + offsetX, points[3].y + offsetY)
            context.closePath() // draws last line of the tile
            context.stroke()
            
            context.fill()
        },

        drawIso3DTile: function(upperLeftX, upperLeftY, offsetX, offsetY, style) {

            this.ctx.fillStyle = style.fillStyle
            this.ctx.strokeStyle = style.strokeStyle

            var x = 0,
                y = 0,
                offsetX = offsetX || 0,
                offsetY = offsetY || 0,
                points = [ 
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + this.TILE_SIZE, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + this.TILE_SIZE, y: upperLeftY + this.TILE_SIZE }),
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY + this.TILE_SIZE })
                ],
                height = this.TILE_SIZE * 1.5,
                dy = offsetY - height - this.HALF_PIXEL

            this.ctx.beginPath()
            // floor
            this.ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY)
            this.ctx.lineTo(points[1].x + offsetX, points[1].y + offsetY)
            this.ctx.lineTo(points[2].x + offsetX, points[2].y + offsetY)
            this.ctx.lineTo(points[3].x + offsetX, points[3].y + offsetY)
            this.ctx.closePath() // draws last line of the tile

            this.ctx.beginPath()
            // ceiling
            this.ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY - height)
            this.ctx.lineTo(points[1].x + offsetX, points[1].y + offsetY - height)
            this.ctx.lineTo(points[2].x + offsetX, points[2].y + offsetY - height)
            this.ctx.lineTo(points[3].x + offsetX, points[3].y + offsetY - height)
            this.ctx.closePath() // draws last line of the tile

            this.ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY)
            this.ctx.lineTo(points[0].x + offsetX, points[0].y + dy)

            this.ctx.moveTo(points[1].x + offsetX, points[1].y + offsetY)
            this.ctx.lineTo(points[1].x + offsetX, points[1].y + dy)

            this.ctx.moveTo(points[2].x + offsetX, points[2].y + offsetY)
            this.ctx.lineTo(points[2].x + offsetX, points[2].y + dy)

            this.ctx.moveTo(points[3].x + offsetX, points[3].y + offsetY)
            this.ctx.lineTo(points[3].x + offsetX, points[3].y + dy)

            this.ctx.stroke()
            
            this.ctx.fill()


        },

        getCartesianTilePosition(e) {
            console.log('screen point: ' + e.x + ', ' + e.y)

            var isoPoint = { x: this.VIEWPORT.x + e.x, y: this.VIEWPORT.y + e.y }
            var cartPoint = this.isometricToCartesian2D(isoPoint)

            console.log('iso point: ' + isoPoint.x + ', ' + isoPoint.y)
            console.log('cart point: ' + cartPoint.x + ', ' + cartPoint.y)

            if(cartPoint.x < 0 || cartPoint.y < 0)
                return;

            var row = parseInt(cartPoint.y / this.TILE_SIZE, 10), 
                col = parseInt(cartPoint.x / this.TILE_SIZE, 10)

            console.log('row: ' + row + ', col: ' + col)

            if(row < 0 || col < 0 || row >= this.ROWS || col >= this.COLS)
                return;

            return { 
                x: col * this.TILE_SIZE, 
                y: row * this.TILE_SIZE,
                row: row,
                col: col
            }
        },

        selectIsoTile: function(e, style) {

            var p = this.getCartesianTilePosition(e)

            if(!p) return;

            style = style || this.selectedTile
            
            style.row = p.row
            style.col = p.col

            console.log(style)

            this.drawIsoTile(p.x, p.y,
                            -(this.VIEWPORT.x), -this.VIEWPORT.y,
                            style)
        },

        highlightIsoTile: function(e) {

            // var p = this.getCartesianTilePosition(e)

            // if(!p) return;

            // this.drawIso3DTile(p.x, p.y,
            //                 -(this.VIEWPORT.x), -this.VIEWPORT.y,
            //                 this.unselectedTile)

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

            var row = parseInt(e.x / this.TILE_SIZE, 10), 
                col = parseInt(e.y / this.TILE_SIZE, 10)

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

            //console.log('highlightTile: [raw.x: ' + e.x + ', raw.y: ' + e.y + ']')
            //var p = this.cartesian2DToIsometric({ x: e.x, y: e.y })
            //console.log('highlightTile: [iso.x: ' + p.x + ', iso.y: ' + p.y + ']')
            var row = parseInt(e.x / this.TILE_SIZE, 10), 
                col = parseInt(e.y / this.TILE_SIZE, 10)

            // console.log('highlightedTile: [row: ' + row + ', col: ' + col)

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
                    this.selectIsoTile(e)
                    break;

                case this.EventTypeEnum.MOVE:
                    this.highlightIsoTile(e)
                    break;

                case this.EventTypeEnum.LEFT:
                    this.moveViewport(-this.TILE_SIZE, 0)
                    break;
                
                case this.EventTypeEnum.RIGHT:
                    this.moveViewport(this.TILE_SIZE, 0)
                    break;

                case this.EventTypeEnum.UP:
                    this.moveViewport(0, -this.TILE_SIZE)
                    break;
                
                case this.EventTypeEnum.DOWN:
                    this.moveViewport(0, this.TILE_SIZE)
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

        mm_canvas = document.createElement('canvas')
        mm_canvas.width = 320
        mm_canvas.height = 240
        mm_canvas.id = 'mm_canvas2d'

        if(document.getElementById('canvas2d') == null) {
            document.body.appendChild(canvas)

            if(document.getElementById('mm_canvas2d') == null)
                document.body.appendChild(mm_canvas)

            game.init(canvas, mm_canvas)
        }

    }

    
    init()

    return o

}(TACTICAL || {}))
