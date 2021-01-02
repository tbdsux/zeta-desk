package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"

	"github.com/TheBoringDude/zeta-desk/utils"
	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails"
)

// Items => data file for each collections group
type Items struct {
	datafile string
	datapath string
	runtime  *wails.Runtime
	logger   *wails.CustomLogger
	watcher  *fsnotify.Watcher
}

// NewItemsCollections => attemps to create a new instance of the items
func NewItemsCollections() (*Items, error) {
	items := &Items{}

	// get the homedir
	homedir, err := os.UserHomeDir()
	if err != nil {
		return items, err
	}

	items.datapath = path.Join(homedir, ZETADATADIR, COLLECTIONS_DIR)

	return items, nil
}

// Initialize => initializes and starts watching changes from data file
func (i *Items) Initialize(filename string) error {
	// set vars
	i.datafile = path.Join(i.datapath, filename)
	i.logger = i.runtime.Log.New("Items for " + filename)

	utils.EnsureFileFolder(i.datapath, i.datafile)

	return i.StartWatcher()
}

// StopWatcher => stops watching the file
func (i *Items) StopWatcher() error {
	err := i.watcher.Remove(i.datafile)
	if err != nil {
		return err
	}
	return nil
}

// LoadItems => loads the items from a collection data file
func (i *Items) LoadItems() (string, error) {
	bytes, err := ioutil.ReadFile(i.datafile)
	fmt.Println(i.datafile)
	if err != nil {
		err = fmt.Errorf("Unable to load datafile: %s", i.datafile)
	}

	return string(bytes), err
}

// SaveItems => saves the items to its datafile
func (i *Items) SaveItems(items string) error {
	return ioutil.WriteFile(i.datafile, []byte(items), 0600)
}
