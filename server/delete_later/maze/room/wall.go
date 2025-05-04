package area

// Implements the area interface
// Currently holds no values
type wall struct{}

// Creates and returns a wall
func initWall() *wall {
	return &wall{}
}

// Returns if hero can pass through wall
func (w *wall) canPass() bool {
	return false
}

// Return string representation of wall
// 3x3 string
func (w wall) String() string {
	return "***\n*W*\n***"
}
