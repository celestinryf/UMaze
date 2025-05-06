package model

// This represents the current game
type Game struct {
	theMaze *maze
	theHero *hero
}

// This is the current game being played
var myGame *Game

// Gives an initialzed game. (no initing the hero)
func InitGame() {
	myGame = &Game{
		theMaze: initMaze(),
	}
}

// Return the current gam ebeing played
func GetCurrGame() *Game {
	return myGame
}

// Given a int, sets the hero
func (g *Game) SetHero(theHeroType int) {
	g.theHero = initHero(theHeroType)
}
