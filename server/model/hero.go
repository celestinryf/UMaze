package model

// Hero Type with name, totalHealth, currHealth, and attack.
type hero struct {
	name           string
	totalHealth    int
	currHealth     int
	attack         int
	aquiredPillars []pillar
	aquiredPotions []potion
}

// Inits hero with totalHealth,
// currHealth, attack, and name.
func initHero(heroType int) *hero {
	switch heroType {
	case 0:
		return &hero{
			name:           "Hero0",
			totalHealth:    100,
			currHealth:     100,
			attack:         20,
			aquiredPillars: make([]pillar, 0),
			aquiredPotions: make([]potion, 0),
		}
	default:
		return &hero{
			name:        "Hero1",
			totalHealth: 150,
			currHealth:  150,
			attack:      15,
		}
	}
}
