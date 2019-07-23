package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"ws"
)

type Room struct {
	Name		string
	ClassList	[]Class
}

type Class struct {
	Id		int64
	Name	string
}

var RoomList []Room
var ClassList []Class

func viewHandler(w http.ResponseWriter, r *http.Request) {

	type Data struct {
		Status string
		RoomList template.HTML
		ClassList template.HTML
	}
	param := r.URL.Query()

	data := Data{"Ok", "", ""}
	view := "www/home.html"

	if ws.IsInMap(param, "n") &&  ws.IsInMap(param, "c") { //check numero de room et de class present
	check := false

		for i := 0; i < len(RoomList); i++ {
			if RoomList[i].Name == param["n"][0] && len(RoomList[i].ClassList) < len(ClassList) {
				for j := 0; j < len(RoomList); j++ {
					if RoomList[i].ClassList[j].Name == param["c"][0] {
						check = true
						data.Status = "Classe deja prise"
						break
					}
				}
				if data.Status == "ok" {
					check = true
					//ajout d'une nouvelle classe a la partie
				}
				break
			} else if RoomList[i].Name == param["n"][0] && len(RoomList[i].ClassList) == len(ClassList) {
				check = true
				data.Status = "Partie deja complete"
				break
			}
		}

		if len(RoomList) == 0 || check == false {
			//creation d'une nouvelle partie
			RoomList = append(RoomList, Room{})
		}
	}
	//vRoomList := ""
	//vClassList := ""
	for i:=0; i <  len(RoomList);i++ {
		data.RoomList += template.HTML("<option value=\"" + RoomList[i].Name + "\">" + RoomList[i].Name + "</option>")
	}
	fmt.Printf("%v\n", ClassList)
	for i:=0; i <  len(ClassList);i++ {
		data.ClassList += template.HTML("<option value=\"" + strconv.FormatInt(ClassList[i].Id, 10) + "\">" + ClassList[i].Name + "</option>")
	}
	//fmt.Printf("%v\n", vClassList)
	//data.RoomList = "" //template.HTML(data.RoomList)
	//data.ClassList = template.HTML(data.ClassList)
	//TODO : Gerer la connexion a une partie et une classe deja prise.
	fmt.Printf("%v\n", data)

	t, _ := template.ParseFiles(view)
	t.Execute(w, data)
}

func main() {
	ClassList = append(ClassList, Class{1, "Maire"})
	ClassList = append(ClassList, Class{2, "Industriel"})
	ClassList = append(ClassList, Class{3, "Ecologiste"})

	http.HandleFunc("/", viewHandler)
	fs := http.FileServer(http.Dir("www/sources"))
	http.Handle("/sources/",  http.StripPrefix("/sources/", fs))
	http.HandleFunc ("/api", ws.Api)

	log.Fatal(http.ListenAndServe(":80", nil))



}

