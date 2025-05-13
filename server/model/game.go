package model

// This represents the current game
type Game struct {
	TheMaze *Maze `json:"Maze"`
	TheHero *Hero `json:"Hero"`
}

// This is the current game being played
var myGame *Game

// Gives an initialzed game. (no initing the hero)
func InitGame() {
	myGame = &Game{
		TheMaze: initMaze(),
	}
}

// Return the current gam ebeing played
func GetCurrGame() *Game {
	return myGame
}

// Given a int, sets the hero
func (g *Game) SetHero(theHeroType int) {
	g.TheHero = initHero(theHeroType)
}
