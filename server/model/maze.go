package model

import "math/rand"

// The maze has a 2d array of rooms
// The start is initially the start of the maze, then as
// the user move, the start is what is updated.
// The end is where the final room (where the user escapes)
type maze struct {
	arr   [][]*room
	currR int
	currC int
	endR  int
	endC  int
}

// // This will create a maze with rows x cols dimensions
// // It will then initialize all the rooms inside of it
// // It will also choose a start and the end point of the maze
func initMaze() *maze {

	newMaze := &maze{
		arr: make([][]*room, mazeHeight),
	}

	modelMaze := newModelMaze()

	for i := range mazeHeight {
		newMaze.arr[i] = make([]*room, mazeWidth)
		for j := range mazeHeight {
			newMaze.arr[i][j] = initRoom(modelMaze[i][j] == pathId)
		}
	}

	newMaze.currR, newMaze.currC, newMaze.endR, newMaze.endC = newMaze.selectStartEnd()

	return newMaze
}

func (m *maze) selectStartEnd() (int, int, int, int) {

	var startR, startC, endR, endC int

	//generate start
	for {
		startR = rand.Intn(mazeHeight)
		startC = rand.Intn(mazeWidth)
		if m.arr[startR][startC].canPass {
			break
		}
	}
	// generate end
	for {
		endR = rand.Intn(mazeHeight)
		endC = rand.Intn(mazeWidth)
		if m.arr[endR][endC].canPass && (startR != endR || startC != endC) {
			break
		}
	}
	return startR, startC, endR, endC
}
