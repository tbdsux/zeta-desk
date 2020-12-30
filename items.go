package main

import (
	"os"
	"path"

	"github.com/TheBoringDude/zeta-desk/utils"
	"github.com/wailsapp/wails"
)

// Items => data file for each collections group
type Items struct {
	datafile string
	datapath string
	runtime  *wails.Runtime
	logger   *wails.CustomLogger
}

// NewItemsCollections => attemps to create a new instance of the items
func NewItemsCollections() (*Items, error) {
	items := &Items{}

	// get the homedir
	homedir, err := os.UserHomeDir()
	if err != nil {
		return items, err
	}

	items.datapath = path.Join(homedir, ZETADATADIR, "data")

	return items, nil
}

// Initialize => initializes and starts watching changes from data file
func (i *Items) Initialize(filename string) error {
	// set vars
	i.datafile = path.Join(i.datapath, filename)
	i.logger = i.runtime.Log.New("Items for " + filename)

	utils.EnsureFileFolder(i.datapath, i.datafile)

	return utils.StartWatcher(i.runtime, i.logger, i.datafile, "itemsmodified")
}

// LoadItems => loads the items from a collection data file
func (i *Items) LoadItems() {

}
