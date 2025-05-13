package model

// Hero Type with name, totalHealth, currHealth, and attack.
type Hero struct {
	Name           string   `json:"name"`
	TotalHealth    int      `json:"totalHealth"`
	CurrHealth     int      `json:"currHealth"`
	Attack         int      `json:"attack"`
	AquiredPillars []Pillar `json:"aquiredPillars"`
	AquiredPotions []Potion `json:"aquiredPotions"`
}

// Inits hero with totalHealth,
// currHealth, attack, and name.
func initHero(heroType int) *Hero {
	switch heroType {
	case 0:
		return &Hero{
			Name:           "Hero0",
			TotalHealth:    100,
			CurrHealth:     100,
			Attack:         20,
			AquiredPillars: make([]Pillar, 0),
			AquiredPotions: make([]Potion, 0),
		}
	default:
		return &Hero{
			Name:        "Hero1",
			TotalHealth: 150,
			CurrHealth:  150,
			Attack:      15,
		}
	}
}
