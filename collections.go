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

// DEFAULTCOLLECTIONSLIST => the default file where the collections are stored
var DEFAULTCOLLECTIONSLIST string = "collections.json"

// ZETADATADIR => default data directory for the app
var ZETADATADIR string = ".zeta_data"

// Collections => main structs for the app
type Collections struct {
	filename string
	datapath string
	runtime  *wails.Runtime
	logger   *wails.CustomLogger
	watcher  *fsnotify.Watcher
}

// NewCollections => attemps to create a new Collections list
func NewCollections() (*Collections, error) {
	// create a new Collections instance
	cols := &Collections{}

	// get the homedir
	homedir, err := os.UserHomeDir()
	if err != nil {
		return cols, err
	}

	dataFile := path.Join(homedir, ZETADATADIR, DEFAULTCOLLECTIONSLIST)

	// set the data file
	cols.filename = dataFile

	return cols, nil
}

// LoadCollections => loads the stored list of collections
func (c *Collections) LoadCollections() (string, error) {
	colBytes, err := ioutil.ReadFile(c.filename)
	if err != nil {
		err = fmt.Errorf("Unable to open list: %s", c.filename)
	}

	return string(colBytes), err
}

// SaveCollections => saves the collections to the data file
func (c *Collections) SaveCollections(collections string) error {
	return ioutil.WriteFile(c.filename, []byte(collections), 0600)
}

// CreateDataFile => creates the data file for the collection
func (c *Collections) CreateDataFile(filename string) {
	dataPath := path.Join(c.datapath, "data")
	dataFile := path.Join(dataPath, filename)
	
	// create the initial file
	utils.EnsureFileFolder(dataPath, dataFile)
}