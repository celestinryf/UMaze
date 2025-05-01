package maze

import "math/rand"

type Maze struct {
	arr   [][]area
	rooms []*room
	currR int
	currC int
}

// add getters and setters
// add a toString method

func InitMaze() *Maze {

	newMaze := &Maze{
		arr:   make([][]area, mazeHeight),
		rooms: make([]*room, 0),
	}

	modelMaze := newModelMaze()

	for i := range mazeHeight {
		newMaze.arr[i] = make([]area, mazeWidth)
		for j := range mazeHeight {
			if modelMaze[i][j] == pathId {
				newRoom := initRoom()
				newMaze.arr[i][j] = newRoom
				newMaze.rooms = append(newMaze.rooms, newRoom)
			} else {
				newMaze.arr[i][j] = initWall()
			}
		}
	}

	newMaze.rooms[rand.Intn(len(newMaze.rooms)-1)].isExit = true

	// make sure starting rooms / ending rooms have nothing else in them
	// one item per room

	var startingRoom *room
	for {
		startingRoom = newMaze.rooms[rand.Intn(len(newMaze.rooms)-1)]
		if !startingRoom.isExit {
			break
		}
	}
	for i := range newMaze.arr {
		for j := range newMaze.arr[0] {
			if newMaze.arr[i][j] == startingRoom {
				newMaze.currR = i
				newMaze.currC = j
			}
		}
	}

	return newMaze
}
