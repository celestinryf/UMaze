package model

import "math/rand"

// maze has dimensions of mazeSize * mazeSize
const mazeSize = 21

// Holds the grid of the maze.
type maze struct {
	grid [mazeSize][mazeSize]*room
}

// inits the maze struct and returns a pointer to a maze
func initMaze() *maze {

	newMaze := maze{
		grid: newGrid(),
	}

	// set up valid rooms
	validRooms := make([]*room, 0)
	for i := range newMaze.grid {
		for j := range newMaze.grid[0] {
			if newMaze.grid[i][j].roomType == path {
				validRooms = append(validRooms, newMaze.grid[i][j])
			}
		}
	}

	// make a starting room
	randInt := rand.Intn(len(validRooms) - 1)
	validRooms[randInt].roomType = start
	validRooms = removeElement(validRooms, randInt)
	// make an ending room
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].roomType = end
	validRooms = removeElement(validRooms, randInt)
	// set pillar1
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].pillarType = pillar1
	validRooms = removeElement(validRooms, randInt)
	// set pillar2
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].pillarType = pillar2
	validRooms = removeElement(validRooms, randInt)
	// set pillar3
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].pillarType = pillar3
	validRooms = removeElement(validRooms, randInt)
	// set pillar4
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].pillarType = pillar4
	validRooms = removeElement(validRooms, randInt)

	// sets up potions, monsters, and pits
	for _, val := range validRooms {
		val.setUpRoom()
	}

	return &newMaze
}

func removeElement(slice []*room, index int) []*room {
	return append(slice[:index], slice[index+1:]...)
}
