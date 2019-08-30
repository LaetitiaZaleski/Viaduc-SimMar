package ws

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
)

/*
	PARTIE DE DECLARATION DES STRUCTURES
*/
type Games struct {
	Param url.Values
	RoomList  []Room
	ClassList []Class
}

type Room struct {
	Name      string
	ClassList []Class
	Settings Settings
}

type Class struct {
	Id          int64
	Name        string
	Description string
	Settings Settings
	Preferences Preferences

}

type Settings struct {
	ValuePeche int64
	ValueTortue int64
	ValuePoisson int64
	ValueRepro int64
}

type Preferences struct {

}

/*
	PARTIE DE DECLARATION DES FONCTIONS
*/
func Initialisation() Games {

	var g Games
	g.ClassList = append(g.ClassList, Class{1, "Maire", "", Settings{}, Preferences{}})
	g.ClassList = append(g.ClassList, Class{2, "Industriel", "", Settings{}, Preferences{}})
	g.ClassList = append(g.ClassList, Class{3, "Ecologiste", "", Settings{}, Preferences{}})

	return g
}

func (g *Games) AddRoom(name string, idFirstClass int64) {
	firstClass := g.getClass(idFirstClass)
	room := Room{name, nil, Settings{50,50,50,50}}
	room.ClassList = append(room.ClassList, *firstClass)
	g.RoomList = append(g.RoomList, room)
	fmt.Printf("ROOM LIST : %v \n", g.RoomList)

}

func (g *Games) AddClass(nameRoom string, idClass int64) {
	class := *g.getClass(idClass)
	room := *g.GetRoom(nameRoom)
	fmt.Printf("%v \n %v\n", class, room)
	room.ClassList = append(room.ClassList, class)
}

func (g *Games) GetRoom(name string) *Room {
	for i := 0; i < len(g.RoomList); i++ {
		if g.RoomList[i].Name == name {
			return &g.RoomList[i]
		}
	}
	return nil
}

func (g *Games) getClassFromRoom(room *Room, id int64) *Class {
	if room != nil {
		for i := 0; i < len(room.ClassList); i++ {
			if room.ClassList[i].Id == id {
				return &room.ClassList[i]
			}
		}
	}

	return nil
}

func (g *Games) getClass(id int64) *Class {

	for i := 0; i < len(g.ClassList); i++ {
		if g.ClassList[i].Id == id {
			return &g.ClassList[i]
		}
	}
	return nil
}

func (g *Games) showRules(w http.ResponseWriter, r *http.Request) {
	param := r.URL.Query()
	if IsInMap(param, "n") && IsInMap(param, "c") {
		/*
			Check ET / OU creation de la partie et de la class
		*/
		check := false
		room := g.GetRoom(param["n"][0])

		classId, err := strconv.ParseInt(param["c"][0], 10, 64)
		if err != nil {
			fmt.Println("ERROR CLASS ID")
			http.Error(w, "400 - rules error!", 400)
			return
		}
		class := g.getClassFromRoom(room, classId)
		addClass := false
		if class == nil { // add class to room
			class = g.getClass(classId)
			if class == nil {
				fmt.Println("ERROR CLASS ID")
				http.Error(w, "400 - rules error!", 400)
				return
			}
			addClass = true
		}
		if room == nil { // create room
			g.AddRoom(param["n"][0], classId)
		}
		fmt.Printf("GAMES : %+v\n", g)
		if addClass { //ajout d'une class a une room
			g.AddClass(param["n"][0], classId)
		}

		if len(g.RoomList) == 0 || check == false {
			//creation d'une nouvelle partie
			g.RoomList = append(g.RoomList, Room{})
		}

		/*
			Affichage de la page RULES
		*/
		type Data struct {
			Desc       string
			Url1stPict string
			Url2ndPict string
		}
		content, err := ioutil.ReadFile("www/sources/files/rules.txt")
		if err != nil {
			http.Error(w, "400 - rules error!", 400)
			return
		}

		data := Data{string(content),

			"sources/img/carte1.png",
			"sources/img/carte2.png"}
		view := "www/rules.html"

		t, _ := template.ParseFiles(view)
		t.Execute(w, data)

	} else {
		http.Error(w, "400 - rules error!", 400)
		return
	}
}

func (g *Games) showSettings(w http.ResponseWriter, r *http.Request) {


	room := g.GetRoom(g.Param["n"][0])
	if room == nil {
		g.showHome(w,r)
		return
	}
	view := "www/dynamique.html"
	t, _ := template.ParseFiles(view)
    t.Execute(w, room.Settings)

}

func (g *Games) showPreference(w http.ResponseWriter, r *http.Request) {
	type Data struct {
		Status    string
		RoomList  template.HTML
		ClassList template.HTML
	}

	data := Data{"Ok", "", ""}
	view := "www/preference.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, data)
}

func (g *Games) showHome(w http.ResponseWriter, r *http.Request) {
	type Data struct {
		Status    string
		RoomList  template.HTML
		ClassList template.HTML
	}

	data := Data{"Ok", "", ""}
	view := "www/home.html"

	for i := 0; i < len(g.RoomList); i++ {
		data.RoomList += template.HTML("<option value=\"" + g.RoomList[i].Name + "\">" + g.RoomList[i].Name + "</option>")
	}

	for i := 0; i < len(g.ClassList); i++ {
		data.ClassList += template.HTML("<option value=\"" + strconv.FormatInt(g.ClassList[i].Id, 10) + "\">" + g.ClassList[i].Name + "</option>")
	}

	//TODO : Gerer la connexion a une partie et une classe deja prise.

	t, _ := template.ParseFiles(view)
	t.Execute(w, data)
}

func (g *Games) ViewHandler(w http.ResponseWriter, r *http.Request) {

	/*
		Etape 3 :Gestion des vues en HTML : ce que voit l'utilisateur en fonction des parametres de l'URL.
	*/
	/*
		Param : p = Page (page a afficher) home / rules / setting 1 /
				n = Name (nom de la partie)
				c = Classe (classe du joueur)
	*/
	g.Param = r.URL.Query()
	view := "home"
	if IsInMap(g.Param, "p") {
		view = g.Param["p"][0]
	}
	switch view {
	case "rules":
		g.showRules(w, r)
		break
	case "settings":
		g.showSettings(w, r)
		break
	case "preference":
		g.showPreference(w, r)
		//TODO : page des prefences du joueurs  puis check si resultat dispo
		break
	case "result":
		//TODO : page des resulats
		break
	default:
		g.showHome(w, r)
		break
	}
	type Data struct {
		Status    string
		RoomList  template.HTML
		ClassList template.HTML
	}
}
