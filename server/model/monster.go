package model

// Monster type with name, totalHealth,
// currHealth, and attack
type monster struct {
	name        string
	totalHealth int
	currHealth  int
	attack      int
}

// inits a default monster
func initMonster() *monster {
	newMonster := &monster{
		name:        "Defualt Monster",
		totalHealth: 25,
		currHealth:  25,
		attack:      10,
	}
	return newMonster
}
