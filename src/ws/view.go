package ws

import (
	"encoding/json"
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
	MessageList []Message
}

type Class struct {
	Id          int64
	Name        string
	Description string
	Settings Settings
	Preferences Preferences

}

type Settings struct {
	RoomName string `json:"room_name"`
	ClassId string `json:"class_id"`
	ValuePeche int64 `json:"value_peche"`
	ValueTortue int64 `json:"value_tortue"`
	ValuePoisson int64 `json:"value_poisson"`
	ValueRepro int64 `json:"value_repro"`
}

type Preferences struct {
	RoomName string `json:"room_name"`
	ClassId string `json:"class_id"`

	ValueAniMin int64 `json:"value_ani_min"`
	ValueCapMin int64 `json:"value_cap_min"`
	ValueTourMin int64 `json:"value_tour_min"`

	ValueAniMax int64 `json:"value_ani_max"`
	ValueCapMax int64 `json:"value_cap_max"`
	ValueTourMax int64 `json:"value_tour_max"`

	ValueEnvMin int64 `json:"value_env_min"`
	ValueOuvMin int64 `json:"value_ouv_min"`

	ValueEnvMax int64 `json:"value_env_max"`
	ValueOuvMax int64 `json:"value_ouv_max"`

	ValueAniFauxMin int64 `json:"value_ani_faux_min"`
	ValueCapFauxMin int64 `json:"value_cap_faux_min"`
	ValueTourFauxMin int64 `json:"value_tour_faux_min"`

	ValueAniFauxMax int64 `json:"value_ani_faux_max"`
	ValueCapFauxMax int64 `json:"value_cap_faux_max"`
	ValueTourFauxMax int64 `json:"value_tour_faux_max"`

	ValueEnvFauxMin int64 `json:"value_env_faux_min"`
	ValueOuvFauxMin int64 `json:"value_ouv_faux_min"`

	ValueEnvFauxMax int64 `json:"value_env_faux_max"`
	ValueOuvFauxMax int64 `json:"value_ouv_faux_max"`

	ImpAniMin int64 `json:"imp_ani_min"`
	ImpCapMin int64 `json:"imp_cap_min"`
	ImpTourMin int64 `json:"imp_tour_min"`

	ImpAniMax int64 `json:"imp_ani_max"`
	ImpCapMax int64 `json:"imp_cap_max"`
	ImpTourMax int64 `json:"imp_tour_max"`

	ImpEnvMin int64 `json:"imp_env_min"`
	ImpOuvMin int64 `json:"imp_ouv_min"`

	ImpEnvMax int64 `json:"imp_env_max"`
	ImpOuvMax int64 `json:"imp_ouv_max"`

}



/*
	PARTIE DE DECLARATION DES FONCTIONS
*/

func Initialisation() Games {

	var g Games
	g.ClassList = append(g.ClassList, Class{1, "Maire", "", Settings{},
		Preferences{"","",500, 1500, 1000, 5000,
			15000, 10000, 0, 0, 50, 30,400,
			1000, 800,10000,20000, 12000,
			0,0,50,40,1,1,1,
			1,1,1,1,1,1,1}})

	g.ClassList = append(g.ClassList, Class{2, "Pecheur", "", Settings{},
		Preferences{"", "",500, 1500, 1000, 2500,
		20000, 10000, 0, 0, 100, 20,400,
		1000, 800,10000,20000, 12000,
		0,0,50,40,1,1,1,
			1,1,1,1,1,1,1} })

	g.ClassList = append(g.ClassList, Class{3, "Ecologiste", "", Settings{},
		Preferences{"", "", 2000, 1500, 500, 20000,
		20000, 20000, 20, 10, 100, 50,1000,
		1000, 300,20000,20000, 20000, 0,
		0,100,50,1,1,1,
			1,1,1,1,1,1,1} })

	return g
}

func (g *Games) AddRoom(name string, idFirstClass int64) {
	firstClass := g.getClass(idFirstClass)
	room := Room{name, nil, Settings{"", "",50,50,50,50}, []Message{}}
	room.ClassList = append(room.ClassList, *firstClass)
	g.RoomList = append(g.RoomList, room)
	fmt.Printf("ROOM LIST : %v \n", g.RoomList)

}

func (g *Games) AddClass(nameRoom string, idClass int64) {
	class := g.getClass(idClass)
	room := g.GetRoom(nameRoom)
	fmt.Printf(" add class : %v \n %v\n \n", class, room)
	room.ClassList = append(room.ClassList, *class)

	fmt.Printf(" add class 2 : %v \n %v\n \n", class, room)
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

	if IsInMap(g.Param, "n") && IsInMap(g.Param, "c") &&
		len(g.Param["n"][0]) > 0 && len(g.Param["n"][0]) > 0 {
		/*
			Check ET / OU creation de la partie et de la class
		*/
		//check := false
		room := g.GetRoom(g.Param["n"][0])

		classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
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
		fmt.Printf("add class : %v \n", addClass)
		if room == nil { // create room
			g.AddRoom(g.Param["n"][0], classId)
		} else if addClass { //ajout d'une class a une room
			g.AddClass(g.Param["n"][0], classId)
		}
		js, _ := json.Marshal(g)
		fmt.Printf("GAMES : %+v\n", string(js))

/*		if len(g.RoomList) == 0 || check == false {
			//creation d'une nouvelle partie
			g.RoomList = append(g.RoomList, Room{})
		}*/

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

			"sources/img/carte.png",
			"sources/img/carte.png"}
		view := "www/rules.html"

		t, _ := template.ParseFiles(view)
		t.Execute(w, data)

	} else {
		http.Error(w, "400 - rules error!", 400)
		return
	}
}

func (g *Games) showSettings(w http.ResponseWriter, r *http.Request) {
	if !IsInMap(g.Param, "n") || !IsInMap(g.Param, "c") ||
		len(g.Param["n"][0]) == 0 || len(g.Param["n"][0]) == 0 {
		http.Error(w, "400 - Settings error!", 400)
		return
	}

	classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
	if err != nil {
		fmt.Println("ERROR CLASS ID")
		http.Error(w, "400 - rules error!", 400)
		return
	}
	var setting Settings
	class := g.getClassFromRoom(g.GetRoom(g.Param["n"][0]), classId)
	if class == nil {
		g.showHome(w,r)
		return
	}

	if class.Settings.ValueTortue == 0 { // NOT SET
		room := g.GetRoom(g.Param["n"][0])
		if room == nil {
			g.showHome(w,r)
			return
		}
		setting = room.Settings

	} else {
		setting = class.Settings

	}
	setting.RoomName = g.Param["n"][0]
	setting.ClassId = g.Param["c"][0]
	view := "www/dynamique.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, setting)
}

func (g *Games) showPreference(w http.ResponseWriter, r *http.Request) {
	if !IsInMap(g.Param, "n") || !IsInMap(g.Param, "c") ||
		len(g.Param["n"][0]) == 0 || len(g.Param["n"][0]) == 0 {
		http.Error(w, "400 - Settings error!", 400)
		return
	}
	classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
	if err != nil {
		fmt.Println("ERROR CLASS ID")
		http.Error(w, "400 - rules error!", 400)
		return
	}
	room := g.GetRoom(g.Param["n"][0])
	class := g.getClassFromRoom(room, classId)
	if class == nil {
		g.showHome(w,r)
		return
	}
	/*
		creation des strings pour voir les preferences des autres roles
	*/
	ValueAniRole1 := ""
	ValueAniRole2 := ""
	ValueCapRole1 := ""
	ValueCapRole2 := ""
	ValueTourRole1 := ""
	ValueTourRole2 := ""
	ValueEnvRole1 := ""
	ValueEnvRole2 := ""
	ValueOuvRole1 := ""
	ValueOuvRole2 := ""

	for i := 0; i < len(g.ClassList); i++ {
		if g.ClassList[i].Id != classId {
			tmpClass := g.getClassFromRoom(room, g.ClassList[i].Id)
			if tmpClass == nil {
				tmpClass = &g.ClassList[i]
			}
			if len(ValueAniRole1) == 0 {
				ValueAniRole1 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueAniMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueAniMax,10)
				ValueCapRole1 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueCapMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueCapMax,10)
				ValueTourRole1 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueTourMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueTourMax,10)
				ValueEnvRole1 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueEnvMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueEnvMax,10)
				ValueOuvRole1 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueOuvMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueOuvMax,10)
			} else {
				ValueAniRole2 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueAniMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueAniMax,10)
				ValueCapRole2 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueCapMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueCapMax,10)
				ValueTourRole2 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueTourMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueTourMax,10)
				ValueEnvRole2 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueEnvMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueEnvMax,10)
				ValueOuvRole2 = tmpClass.Name +"&#58; " + strconv.FormatInt(tmpClass.Preferences.ValueOuvMin,10) + "," + strconv.FormatInt(tmpClass.Preferences.ValueOuvMax,10)
			}
		}
	}

	type PreferencesPage struct {
		RoomName string `json:"room_name"`
		ClassId string `json:"class_id"`

		ValueAniMin int64
		ValueCapMin int64
		ValueTourMin int64

		ValueAniMax int64
		ValueCapMax int64
		ValueTourMax int64

		ValueEnvMin int64
		ValueOuvMin int64

		ValueEnvMax int64
		ValueOuvMax int64

		ValueAniFauxMin int64
		ValueCapFauxMin int64
		ValueTourFauxMin int64

		ValueAniFauxMax int64
		ValueCapFauxMax int64
		ValueTourFauxMax int64

		ValueEnvFauxMin int64
		ValueOuvFauxMin int64

		ValueEnvFauxMax int64
		ValueOuvFauxMax int64

		ImpAniMin int64
		ImpCapMin int64
		ImpTourMin int64

		ImpAniMax int64
		ImpCapMax int64
		ImpTourMax int64

		ImpEnvMin int64
		ImpOuvMin int64

		ImpEnvMax int64
		ImpOuvMax int64

		ValueAniRole1 string
		ValueAniRole2 string
		ValueCapRole1 string
		ValueCapRole2 string
		ValueTourRole1 string
		ValueTourRole2 string
		ValueEnvRole1 string
		ValueEnvRole2 string
		ValueOuvRole1 string
		ValueOuvRole2 string
	}


	pref := PreferencesPage{ g.Param["n"][0],
		g.Param["c"][0],
		class.Preferences.ValueAniMin,
		class.Preferences.ValueCapMin,
		class.Preferences.ValueTourMin,
		class.Preferences.ValueAniMax,
		class.Preferences.ValueCapMax,
		class.Preferences.ValueTourMax,
		class.Preferences.ValueEnvMin,
		class.Preferences.ValueOuvMin,
		class.Preferences.ValueEnvMax,
		class.Preferences.ValueOuvMax,
		class.Preferences.ValueAniFauxMin,
		class.Preferences.ValueCapFauxMin,
		class.Preferences.ValueTourFauxMin,
		class.Preferences.ValueAniFauxMax,
		class.Preferences.ValueCapFauxMax,
		class.Preferences.ValueTourFauxMax,
		class.Preferences.ValueEnvFauxMin,
		class.Preferences.ValueOuvFauxMin,
		class.Preferences.ValueEnvFauxMax,
		class.Preferences.ValueOuvFauxMax,
		class.Preferences.ImpAniMin,
		class.Preferences.ImpCapMin,
		class.Preferences.ImpTourMin,
		class.Preferences.ImpAniMax,
		class.Preferences.ImpCapMax,
		class.Preferences.ImpTourMax,
		class.Preferences.ImpEnvMin,
		class.Preferences.ImpOuvMin,
		class.Preferences.ImpEnvMax,
		class.Preferences.ImpOuvMax,
		ValueAniRole1,
		ValueAniRole2,
		ValueCapRole1,
		ValueCapRole2,
		ValueTourRole1,
		ValueTourRole2,
		ValueEnvRole1,
		ValueEnvRole2,
		ValueOuvRole1,
		ValueOuvRole2,
	}
	//pref := class.Preferences
	pref.RoomName = g.Param["n"][0]
	pref.ClassId = g.Param["c"][0]
	fmt.Printf("pref : %+v\n", pref)
	view := "www/preference.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, pref)
}

func (g *Games) showResult(w http.ResponseWriter, r *http.Request) {
	type Data struct {
		MessageList  template.HTML
	}
	room := g.GetRoom(g.Param["n"][0])
	data := Data{}
	view := "www/result.html"
	MessageList := room.GetMessage(0)
	for i := 0; i < len(MessageList); i++ {
		data.MessageList += template.HTML("<li id=\"message-id-" + strconv.FormatInt(MessageList[i].Id,10) + "\">(" + MessageList[i].Date + ") "+ MessageList[i].ClassName + " : " + MessageList[i].Message  +  "</option>")
	}

	t, _ := template.ParseFiles(view)
	t.Execute(w, data)
}

func (g *Games) showNonVide(w http.ResponseWriter, r *http.Request) {
	classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
	if err != nil {
		fmt.Println("ERROR CLASS ID")
		http.Error(w, "400 - rules error!", 400)
		return
	}
	class := g.getClassFromRoom(g.GetRoom(g.Param["n"][0]), classId)
	if class == nil {
		g.showHome(w,r)
		return
	}
	pref := class.Preferences
	view := "www/nonvide.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, pref)
}


func (g *Games) showImportances(w http.ResponseWriter, r *http.Request) {
	classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
	if err != nil {
		fmt.Println("ERROR CLASS ID")
		http.Error(w, "400 - rules error!", 400)
		return
	}
	class := g.getClassFromRoom(g.GetRoom(g.Param["n"][0]), classId)
	if class == nil {
		g.showHome(w,r)
		return
	}
	pref := class.Preferences
	view := "www/importances.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, pref)
}

func (g *Games) showNonVidep2(w http.ResponseWriter, r *http.Request) {
	classId, err := strconv.ParseInt(g.Param["c"][0], 10, 64)
	if err != nil {
		fmt.Println("ERROR CLASS ID")
		http.Error(w, "400 - rules error!", 400)
		return
	}
	class := g.getClassFromRoom(g.GetRoom(g.Param["n"][0]), classId)
	if class == nil {
		g.showHome(w,r)
		return
	}
	pref := class.Preferences
	view := "www/nonvidep2.html"
	t, _ := template.ParseFiles(view)
	t.Execute(w, pref)
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
		//g.showResult(w,r)
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
		g.showResult(w,r)
		//TODO : page des resulats
		break
	case "nonvide":
		g.showNonVide(w,r)
		break
	case "nonvidep2":
		g.showNonVidep2(w,r)
		break
	case "importances":
		g.showImportances(w,r)
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
