package model

var currGame *Game

type Game struct {
	maze string
	hero string
}

func InitGame() {
	currGame = &Game{
		maze: "I am the Maze",
	}
}

func GetCurrGame() *Game {
	return currGame
}

func (g *Game) SetHero(theHeroType int) {
	if theHeroType == 1 {
		g.hero = "One"
	} else {
		g.hero = "Default"
	}
}
