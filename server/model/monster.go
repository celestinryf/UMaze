package model

// Monster type with name, totalHealth,
// currHealth, and attack
type Monster struct {
	Name        string `json:"name"`
	TotalHealth int    `json:"totalHealth"`
	CurrHealth  int    `json:"currHealth"`
	Attack      int    `json:"attack"`
}

// inits a default monster
func initMonster() *Monster {
	newMonster := &Monster{
		Name:        "Defualt Monster",
		TotalHealth: 25,
		CurrHealth:  25,
		Attack:      10,
	}
	return newMonster
}
