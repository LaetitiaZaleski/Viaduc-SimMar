package ws

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
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

func SendPostRequest (url string, filename string, filetype string) []byte {
	file, err := os.Open(filename)

	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()


	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(filetype, filepath.Base(file.Name()))

	if err != nil {
		log.Fatal(err)
	}

	io.Copy(part, file)
	writer.Close()

	//Payload := strings.NewReader("script=Pi.oms&jab=") + body
	//'script=Pi.oms' -F 'workDirectory=@pi.tgz'
	request, err := http.NewRequest("POST", url, body)

	if err != nil {
		log.Fatal(err)
	}

	request.Header.Add("Content-Type", writer.FormDataContentType())
	client := &http.Client{}

	response, err := client.Do(request)

	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	content, err := ioutil.ReadAll(response.Body)

	if err != nil {
		log.Fatal(err)
	}

	return content
}


func isKernelEmpty(fileName string) bool{
	boolEmpty := true

	readFile, err := os.Open(fileName)

	if err != nil {
		log.Fatalf("failed to open file: %s", err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)
	var fileTextLines []string

	for fileScanner.Scan() {
		fileTextLines = append(fileTextLines, fileScanner.Text())
	}

	readFile.Close()

	for _, eachline := range fileTextLines {

		var vals = strings.Split(eachline, " ")
		if(vals[3]=="1.0"){
			boolEmpty = false
			break;
		}
	}

	return boolEmpty

}