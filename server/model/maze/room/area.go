package area

// The maze will be maze of area
// Only method will be canPass
// Will return is it can be entered
type area interface {
	canPass() bool
}
