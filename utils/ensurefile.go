package utils

import (
	"os"
	"io/ioutil"
)

// EnsureFileFolder => check if the default file exists in the data dir
func EnsureFileFolder(datapath, filename string) {
	// Check status of data folder
	if _, err := os.Stat(datapath); os.IsNotExist(err) {
		// make the directory
		os.MkdirAll(datapath, 0755)
	}

	// check status of file
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		// Create it with a blank list
		ioutil.WriteFile(filename, []byte("[]"), 0600)
	}
}