package ws

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

func Exists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}


func CreateFile(roomName, classId string, s Settings, p Preferences) (ret string) {

	for i:= 0; ; i++ {
		ret = "input/"+roomName+"_"+classId+"_"+strconv.Itoa(i)+".json"

		if !Exists(ret){
			type Json struct {
				Settings Settings `json:"settings"`
				Preferences Preferences `json:"preferences"`
			}

			data := Json{s, p}
			json,err := json.Marshal(data)
			if err != nil {
				fmt.Printf("Unable to write file: %v", err)
				return
			}
			err = ioutil.WriteFile(ret, json, 0755)
			if err != nil {
				fmt.Printf("Unable to write file: %v", err)
				return
			}
			break
		}
	}
	return ret
}
