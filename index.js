/*   https://en.wikipedia.org/wiki/Maze_generation_algorithm    */

// The depth-first search algorithm of maze generation is 
// frequently implemented using backtracking. This can be 
// described with a following recursive routine: 

//  1.   Given a current cell as a parameter,
//  2.   Mark the current cell as visited
//  3.   While the current cell has any unvisited neighbour cells
//  3.1  Choose one of the unvisited neighbours
//  3.2  Remove the wall between the current cell and the chosen cell
//  3.3  Invoke the routine recursively for a chosen cell


const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const log = console.log

const WIDTH = canvas.width = 300
const HEIGHT = canvas.height = 300
const SIZE = 10
const ROWS = WIDTH / SIZE
const COLS = HEIGHT / SIZE

const FPS = 60

const cells = []
const stack = []

let current = null
let frameTimer = 0
let frameInterval = 1000 / FPS

/* ************************************************* */

class Cell {

	constructor(i, j){
  	this.i = i
    this.j = j
    this.visited = false
    // order: top right bottom left
    this.walls = [true, true, true, true]
  }

  draw() {
   		
    ctx.beginPath()
    let x = this.j * SIZE
    let y = this.i * SIZE    

    if(this.walls[0]) {
      ctx.moveTo(x, y)
      ctx.lineTo(x + SIZE, y) 
    }
    if(this.walls[1]) {
      ctx.moveTo(x + SIZE, y)
      ctx.lineTo(x + SIZE, y + SIZE) 
    }
    if(this.walls[2]) {
      ctx.moveTo(x + SIZE, y + SIZE)    
      ctx.lineTo(x, y + SIZE) 
    }
    if(this.walls[3]) {
      ctx.moveTo(x, y + SIZE)
      ctx.lineTo(x, y) 
    }
    ctx.closePath()
    ctx.stroke()

    if(this.visited){    
      ctx.beginPath()
      ctx.fillStyle = "purple"
      ctx.rect(x+1, y+1, SIZE, SIZE)
      ctx.closePath()
      ctx.fill()
    }

    ctx.beginPath()
    ctx.fillStyle = "rgba(155, 250, 0, 0.7)"
    ctx.rect(current.j * SIZE, current.i * SIZE, SIZE, SIZE)
    ctx.closePath()
    ctx.fill()   				
  }
}

/* ************************************************* */

function toIdx(i, j) {
	return i * ROWS + (j % COLS)
}

function randBetween(min, max){
  return Math.floor(Math.random() * (max - min) + min)
}


function makeGrid(){
	for(let i = 0; i < ROWS; i++) {
  	for(let j = 0; j < COLS; j++) {
    	cells.push(new Cell(i, j))
    }
  }  
}

function drawGrid(deltaTime) {

  if(frameTimer > frameInterval) {
  
  	
  	ctx.clearRect(0, 0, WIDTH, HEIGHT)
  
  	for(let cell of cells) {
  		cell.draw()
  	}
    
    // reset the frameTimer
    frameTimer = 0
    
  } else {
    // ...otherwise increase by deltaTime
  	frameTimer += deltaTime
  }  
}

function updateGrid() {
  let i = current.i
  let j = current.j
	let left  = cells[toIdx(i, j-1)]
	let right = cells[toIdx(i, j+1)]
	let top   = cells[toIdx(i-1, j)]
	let down  = cells[toIdx(i+1, j)]
  
  let options = [left, right, top, down]
  let neighbours = []
  for(let option of options){
  	if(option && option.visited) continue
    else if(option) neighbours.push(option)
  }
  if(neighbours.length) {
  	let idx = randBetween(0, neighbours.length)
  	let neighbour = neighbours[idx]
  
  	// calc which walls should be removed
    let dx = current.j - neighbour.j
    let dy = current.i - neighbour.i
    if(dx == -1){
    	// next Cell is on the right side of current, so right wall of curr 
      // and left wall of next Cell should be removed
      current.walls[1] = false
      neighbour.walls[3] = false
    } else if(dx == 1) {
    	// next Cell is on the left side of curr
      current.walls[3] = false
      neighbour.walls[1] = false
    } else if(dy == -1) {
      // next cell is on the bottom side of curr
    	current.walls[2] = false
      neighbour.walls[0] = false
    } else if(dy == 1) {
      // next cell is on the top side of curr
    	current.walls[0] = false
      neighbour.walls[2] = false
    }
    
  	current = neighbour
  	current.visited = true
  
  	stack.push(current)
    
  } else {  	
    stack.pop()
    current = stack[stack.length-1]    
  }  
  // log(stack)
}

/* ************************************************* */

// Init and start the animation

function init(){
  // generate random grid
	makeGrid()  
  // mark the first cell in the 1D Array as visited
  cells[0].visited = true
  // make it the current cell 
  current = cells[0]  
  // ...and push it onto the stack  
  stack.push(current)
  
  animate(0)
}


let lastTime = 0


function animate(timeStamp) {
	
  // calc deltaTime which tells how many milli sec your computer needs for redrawing
	let deltaTime = timeStamp - lastTime 
  lastTime = timeStamp  
	
	drawGrid(deltaTime)
  
  updateGrid()
	
  requestAnimationFrame(animate)
}

init()
