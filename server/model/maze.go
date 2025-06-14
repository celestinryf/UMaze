package model

import (
	"database/sql"
	"errors"
	"math/rand"
	"slices"
)

// Coordinates of the player
type Coords struct {
	X int `json:"X"`
	Y int `json:"Y"`
}

// Holds the grid of the maze.
type Maze struct {
	Grid       [][]*Room `json:"Grid"`
	CurrCoords *Coords   `json:"CurrCoords"`
}

// inits the maze struct and returns a pointer to a maze
func initMaze(db *sql.DB, mazeSize int) (*Maze, error) {

	if db == nil {
		return nil, errors.New("db is nil")
	}

	grid, err := newGrid(mazeSize)
	if err != nil {
		return nil, err
	}

	newMaze := Maze{Grid: grid}

	validRooms := make([]*Room, 0)
	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == "Path" {
				validRooms = append(validRooms, newMaze.Grid[i][j])
			}
		}
	}

	room_list := []string{"Entrance", "Exit"}
	for _, roomType := range room_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].RoomType = roomType
		validRooms = slices.Delete(validRooms, randInt, randInt+1)
	}

	pillar_list := []string{"Apple", "Saddle", "Horn", "Wings"}
	for _, pillar := range pillar_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].PillarType = pillar
		validRooms = slices.Delete(validRooms, randInt, randInt+1)
	}

	roomGenerator, err := getSetUpRoom(db)
	if err != nil {
		return nil, err
	}

	for _, room := range validRooms {
		roomGenerator(room)
	}

	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == "Entrance" {
				newMaze.CurrCoords = &Coords{
					X: i,
					Y: j,
				}
			}
		}
	}

	return &newMaze, nil
}
