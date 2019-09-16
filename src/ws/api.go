package ws

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

func GetFile(roomName string, ch chan<- string) {
	ticker := time.NewTicker(time.Second * 1)
	tmp := 0
	for range ticker.C {
/*
	var file []byte
	var err error
	if Exists("test.txt") {
		file, err = ioutil.ReadFile("test.txt")
	}
	if len(file) > 0 {
   		ch <- string(file)
	}

*/

		//fmt.Printf("fnct %v\n", GetB64Media)
		if tmp == 5 { //TODO : check si le fichier EXISTE !
			ch <- "OK"
		}
		tmp++

	}
}

func Exists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

func IsInMap(dic url.Values, key string) bool {
	_, ok := dic[key]
	return ok
}

func MyExit(w http.ResponseWriter, err error) {
	fmt.Println("ERROR:", err)
	w.WriteHeader(http.StatusInternalServerError)
}


func (g *Games) GetMethod(w http.ResponseWriter, r *http.Request) {
	param := r.URL.Query()
	if !IsInMap(param, "fct") {
		MyExit(w, errors.New("missing func"))
		return
	}
	fnct := param["fct"][0]

	if strings.Compare(fnct, "get_func") == 0 &&
		IsInMap(param, "param1") &&
		IsInMap(param, "param1") {
		//Do some stuff
	} else {
		MyExit(w, errors.New("wrong format GET"))
		return
	}
}

func (g *Games) PostMethod(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	param := r.Form
	if IsInMap(param, "fct") && param["fct"][0] == "set_settings" &&
		IsInMap(param, "room_name") &&
		IsInMap(param, "class_id") &&
		IsInMap(param, "value_peche") &&
		IsInMap(param, "value_tortue") &&
		IsInMap(param, "value_poisson") &&
		IsInMap(param, "value_repro") &&
		len(param["room_name"][0]) > 0 &&
		len(param["class_id"][0]) > 0 &&
		len(param["value_peche"][0]) > 0 &&
		len(param["value_tortue"][0]) > 0 &&
		len(param["value_poisson"][0]) > 0 &&
		len(param["value_repro"][0]) > 0 {
		room := g.GetRoom(param["room_name"][0])

		classId, err := strconv.ParseInt(param["class_id"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - set_settings error! (err conv class_id) " + err.Error(), 500)
			return
		}

		class := g.getClassFromRoom(room, classId)

		ValuePeche, err := strconv.ParseInt(param["value_peche"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - set_settings error! (err conv value_peche) " + err.Error(), 500)
			return
		}
		ValueTortue, err := strconv.ParseInt(param["value_tortue"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - set_settings error! (err conv value_tortue) " + err.Error(), 500)
			return
		}

		ValuePoisson, err := strconv.ParseInt(param["value_poisson"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - set_settings error! (err conv value_poisson) " + err.Error(), 500)
			return
		}
		ValueRepro, err := strconv.ParseInt(param["value_repro"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - set_settings error! (err conv value_repro) " + err.Error(), 500)
			return
		}
		class.Settings.ValuePeche = ValuePeche
		class.Settings.ValueTortue = ValueTortue
		class.Settings.ValuePoisson = ValuePoisson
		class.Settings.ValueRepro = ValueRepro
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok")
	} else if IsInMap(param, "fct") && param["fct"][0] == "lets_calc" &&
		IsInMap(param, "room_name") &&
		IsInMap(param, "class_id") &&
		IsInMap(param, "value_ani_min") &&
		IsInMap(param, "value_ani_max") &&
		IsInMap(param, "value_tour_min") &&
		IsInMap(param, "value_tour_max") &&
		IsInMap(param, "value_cap_min") &&
		IsInMap(param, "value_cap_max") &&
		IsInMap(param, "value_env_min") &&
		IsInMap(param, "value_env_max") &&
		IsInMap(param, "value_ouv_min") &&
		IsInMap(param, "value_ouv_max") &&
		len(param["room_name"][0]) > 0 &&
		len(param["class_id"][0]) > 0 &&
		len(param["value_ani_min"][0]) > 0 &&
		len(param["value_ani_max"][0]) > 0 &&
		len(param["value_tour_min"][0]) > 0 &&
		len(param["value_tour_max"][0]) > 0 &&
		len(param["value_cap_min"][0]) > 0 &&
		len(param["value_cap_max"][0]) > 0 &&
		len(param["value_env_min"][0]) > 0 &&
		len(param["value_env_max"][0]) > 0 &&
		len(param["value_ouv_min"][0]) > 0 &&
		len(param["value_ouv_max"][0]) > 0 {
		room := g.GetRoom(param["room_name"][0])

		classId, err := strconv.ParseInt(param["class_id"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv class_id) " + err.Error(), 500)
			return
		}

		class := g.getClassFromRoom(room, classId)

		ValueAniMin, err := strconv.ParseInt(param["value_ani_min"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_ani_min) " + err.Error(), 500)
			return
		}

		ValueAniMax, err := strconv.ParseInt(param["value_ani_max"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_ani_max) " + err.Error(), 500)
			return
		}

		ValueTourMin, err := strconv.ParseInt(param["value_tour_min"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_tour_min) " + err.Error(), 500)
			return
		}

		ValueTourMax, err := strconv.ParseInt(param["value_tour_max"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_tour_max) " + err.Error(), 500)
			return
		}

		ValueCapMin, err := strconv.ParseInt(param["value_cap_min"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_cap_min) " + err.Error(), 500)
			return
		}

		ValueCapMax, err := strconv.ParseInt(param["value_cap_max"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_cap_max) " + err.Error(), 500)
			return
		}

		ValueEnvMin, err := strconv.ParseInt(param["value_env_min"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_env_min) " + err.Error(), 500)
			return
		}

		ValueEnvMax, err := strconv.ParseInt(param["value_env_max"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_env_max) " + err.Error(), 500)
			return
		}

		ValueOuvMin, err := strconv.ParseInt(param["value_ouv_min"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_ouv_min) " + err.Error(), 500)
			return
		}

		ValueOuvMax, err := strconv.ParseInt(param["value_ouv_max"][0], 10, 64)
		if err != nil {
			http.Error(w, "500 - lets_calc error! (err conv value_ouv_max) " + err.Error(), 500)
			return
		}


		class.Preferences.ValueAniMin = ValueAniMin
		class.Preferences.ValueAniMax = ValueAniMax
		class.Preferences.ValueTourMin = ValueTourMin
		class.Preferences.ValueTourMax = ValueTourMax
		class.Preferences.ValueCapMin = ValueCapMin
		class.Preferences.ValueCapMax = ValueCapMax
		class.Preferences.ValueEnvMin = ValueEnvMin
		class.Preferences.ValueEnvMax = ValueEnvMax
		class.Preferences.ValueOuvMin = ValueOuvMin
		class.Preferences.ValueOuvMax = ValueOuvMax




		/*
				Lancement du Viablab.exe :)
		*/
		var paramExec []string
		paramExec = append(paramExec, "1", "2","3", "2","1")
		cmd := exec.Command("./viabLabExe", paramExec... )
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		if err := cmd.Start(); err != nil { //lancement de l'exe

		}
		//Boucle qui permet d'attendre la creation du fichier pour renver les datas.
		RCtx := r.Context()
		ch := make(chan string)
		go GetFile(param["room_name"][0], ch)
		select {
		case result := <-ch:
			w.WriteHeader(http.StatusOK)
			fmt.Fprint(w, result)
			return
		case <-RCtx.Done():
			fmt.Println("Client has disconnected.")
		}
		<-ch


	} else {
		MyExit(w, errors.New("wrong format POST"))
		return
	}
}



func (g *Games) Api(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	switch r.Method {
	case http.MethodGet:
		g.GetMethod(w,r)
	case http.MethodPost:
		g.PostMethod(w, r)
	case http.MethodPut:
		http.Error(w, "401 - Access denied exit ws!", 401)
	case http.MethodDelete:
		http.Error(w, "401 - Access denied exit ws!", 401)
	default:
		http.Error(w, "401 - Access denied exit ws!", 401)
	}
}

