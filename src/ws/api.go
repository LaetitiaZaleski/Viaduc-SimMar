package ws

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
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


func IsInMap(dic url.Values, key string) bool {
	_, ok := dic[key]
	return ok
}

func MyExit(w http.ResponseWriter, err error) {
	fmt.Println("ERROR:", err)
	w.WriteHeader(http.StatusInternalServerError)
	io.WriteString(w, "ko")
}


func (g *Games) GetMethod(w http.ResponseWriter, r *http.Request) {
	param := r.URL.Query()
	if !IsInMap(param, "fct") {
		MyExit(w, errors.New("missing func"))
		return
	}
	fnct := param["fct"][0]

	if strings.Compare(fnct, "get_message") == 0 &&
		IsInMap(param, "room_name") &&
		IsInMap(param, "class_id") &&
		IsInMap(param, "last_message_id") {
		room := g.GetRoom(param["room_name"][0])
		lastId, err := strconv.ParseInt(param["last_message_id"][0], 10, 64)
		if err != nil {
			MyExit(w, err)
			return
		}
		messageList := room.GetMessage(lastId)
		json,err := json.Marshal(messageList)
		if err != nil {
			MyExit(w, err)
			return
		}
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, string(json))
	} else if strings.Compare(fnct, "get_preference") == 0 &&
		IsInMap(param, "room_name"){
		room := g.GetRoom(param["room_name"][0])
		type AllPref struct {
			ClassName string `json:"class_name"`
			Preferences Preferences `json:"preference"`
		}
		var allpref []AllPref

		for i:=0; i<len(room.ClassList); i++ {
			allpref = append(allpref, AllPref{room.ClassList[i].Name, room.ClassList[i].Preferences})
		}
		json,err := json.Marshal(allpref)
		if err != nil {
			MyExit(w, err)
			return
		}
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, string(json))
	} else {
		MyExit(w, errors.New("wrong format GET"))
		return
	}
}

func (g *Games) PostMethod(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	param := r.Form
	if IsInMap(param, "fct") && param["fct"][0] == "set_settings" &&
		IsInMap(param, "data") &&
		len(param["data"][0]) > 0 {

		var setting Settings
		err := json.Unmarshal([]byte(param["data"][0]), &setting)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		room := g.GetRoom(setting.RoomName)
		classId, err := strconv.ParseInt(setting.ClassId, 10, 64)
		class := g.getClassFromRoom(room, classId)
		class.Settings = setting
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok")
	} else if IsInMap(param, "fct") && param["fct"][0] == "lets_calc" &&
		IsInMap(param, "data") &&
		len(param["data"][0]) > 0 {

		log.Println(fmt.Sprintf("c'est partit pour le calcul \n"))

		var preference Preferences

		err := json.Unmarshal([]byte(param["data"][0]), &preference)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		room := g.GetRoom(preference.RoomName)
		classId, err := strconv.ParseInt(preference.ClassId, 10, 64)
		if err != nil {
			log.Println(fmt.Sprintf("ERREUR 2 !!"))
		}
		class := g.getClassFromRoom(room, classId)
		class.Preferences = preference

		log.Println(fmt.Sprintf("preferences : %v \n", preference))
		log.Println(fmt.Sprintf("classID : %v \n", classId))
		log.Println(fmt.Sprintf("Settings : %v \n", class.Settings))

		/*
			Lancement du calcul / creation du fichier
		*/
		file := CreateFile(room.Name,preference.ClassId,class.Settings, class.Preferences)
		fileOut := strings.Replace(file, ".json", "-viab-0-bound.dat", -1)
		var fileToRemove = strings.Replace(file, ".json", "-viab-0.dat", -1)
		/*
				Lancement du Viablab.exe :)

			del = atof(argv[1]);
		      a = atof(argv[2]);
		      mp = atof(argv[3]);
		      g = atof(argv[4]);

		      localAMin = atof(argv[5]);
		      localAMax = atof(argv[6]);
		      localCMin = atof(argv[7]);
		      localCMax = atof(argv[8]);
		      localTMin = atof(argv[9]);
		      localTMax = atof(argv[10]);

		      localEpsMin = atof(argv[11]);
		      localEpsMax = atof(argv[12]);
		      localZetaMin = atof(argv[13]);
		      localZetaMax = atof(argv[14]);
		*/
		//Boucle qui permet d'attendre la creation du fichier pour renver les datas.
		//RCtx := r.Context()
		//go GetFile(param["room_name"][0], ch)


		/*var paramExec []string
		paramExec = append(paramExec,
			strconv.FormatInt(room.ClassList[0].Settings.ValuePeche,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValueTortue,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValuePoisson,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValueRepro,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueAniMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueAniMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueCapMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueCapMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueTourMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueTourMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueEnvMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueEnvMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueOuvMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueOuvMax,10))*/
		cmd := exec.Command("./bin/viabLabExe", file )
		//cmd := exec.Command("./bin/tmpexe")
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		if err := cmd.Start(); err != nil { //lancement de l'exe

		}

		//Boucle qui permet d'attendre la creation du fichier pour renver les datas.
		done := make(chan error, 1)
		go func() {
			done <-cmd.Wait()
		}()
		select {
		case err := <-done :

			if err != nil {

				MyExit(w, errors.New("err : "+err.Error()))
				return

			}
			var paramMv []string
			var pathOut = "./"+fileOut
			paramMv = append(paramMv,
				pathOut, "./www/sources/output")
			cmdMv := exec.Command("mv",paramMv... )

			cmdMv.Run()
			// supression du fichier inutile
			var paramRm []string
			var pathToRemove = "./"+fileToRemove
			paramRm = append(paramRm, pathToRemove)
			cmdRm := exec.Command("rm",paramRm... )
			cmdRm.Run()


			fmt.Printf("success \n")
			w.WriteHeader(http.StatusOK)

			fileOut := strings.Replace(fileOut, "input", "www/sources/output", -1)

			fo, err := os.Stat(fileOut);
			size := fo.Size()

			var alerte = " "
			if size == 0 {
				alerte = "Ce noyau est vide !"
			} else {
				data, err2 := ioutil.ReadFile(strings.Replace(fileOut, "input", "www/sources/output", -1))
				if err2 != nil {
					fmt.Println(err2)
				}
				var vals = strings.Split(string(data), " ")
				v1, err := strconv.ParseFloat(vals[1], 32)
				if err != nil {
					fmt.Println("v1")
					fmt.Println(err)
				}
				v2, err := strconv.ParseFloat(vals[3], 32)
				if err != nil {
					fmt.Println("v2")
					fmt.Println(err)
				}
				v3, err := strconv.ParseFloat(vals[5], 32)
				if err != nil {
					fmt.Println("v3")
					fmt.Println(err)
				}
				if (v1 < 0) || (v2 < 0) || (v3 < 0){
					alerte = "Ce noyau est vide !"
				}else{
					alerte = "Votre noyau n'est pas vide !"
				}

			}
			fmt.Fprint(w, alerte )
		}
		/*ticker :=time.NewTicker(time.Second*1)
		for range ticker.C {
			select {
			case err := <-done :

				if err != nil {

					MyExit(w, errors.New("err : "+err.Error()))
					return

				}
				var paramMv []string
				paramMv = append(paramMv,
					"./output/*", "./www/output")
				cmdMv := exec.Command("mv",paramMv... )
				cmdMv.Run()
				fmt.Printf("success \n")
				w.WriteHeader(http.StatusOK)
				fmt.Fprint(w, fileOut)
			case <-RCtx.Done():
				fmt.Println("Client has disconnected.")
			}
		}*/

	} else if IsInMap(param, "fct") && param["fct"][0] == "lets_calc" &&
		IsInMap(param, "data") &&
		len(param["data"][0]) > 0 {

		log.Println(fmt.Sprintf("c'est partit pour le calcul \n"))

		var preference Preferences

		err := json.Unmarshal([]byte(param["data"][0]), &preference)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		room := g.GetRoom(preference.RoomName)
		classId, err := strconv.ParseInt(preference.ClassId, 10, 64)
		if err != nil {
			log.Println(fmt.Sprintf("ERREUR 2 !!"))
		}
		class := g.getClassFromRoom(room, classId)
		class.Preferences = preference

		log.Println(fmt.Sprintf("preferences : %v \n", preference))
		log.Println(fmt.Sprintf("classID : %v \n", classId))
		log.Println(fmt.Sprintf("Settings : %v \n", class.Settings))

		/*
			Lancement du calcul / creation du fichier
		*/
		file := CreateFile(room.Name,preference.ClassId,class.Settings, class.Preferences)
		fileOut := strings.Replace(file, ".json", "-viab-0-bound.dat", -1)
		var fileToRemove = strings.Replace(file, ".json", "-viab-0.dat", -1)
		/*
					Lancement du Viablab.exe :)

				del = atof(argv[1]);
			      a = atof(argv[2]);
			      mp = atof(argv[3]);
			      g = atof(argv[4]);

			      localAMin = atof(argv[5]);
			      localAMax = atof(argv[6]);
			      localCMin = atof(argv[7]);
			      localCMax = atof(argv[8]);
			      localTMin = atof(argv[9]);
			      localTMax = atof(argv[10]);

			      localEpsMin = atof(argv[11]);
			      localEpsMax = atof(argv[12]);
			      localZetaMin = atof(argv[13]);
			      localZetaMax = atof(argv[14]);
		*/
		//Boucle qui permet d'attendre la creation du fichier pour renver les datas.
		//RCtx := r.Context()
		//go GetFile(param["room_name"][0], ch)


		/*var paramExec []string
		paramExec = append(paramExec,
			strconv.FormatInt(room.ClassList[0].Settings.ValuePeche,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValueTortue,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValuePoisson,10),
			strconv.FormatInt(room.ClassList[0].Settings.ValueRepro,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueAniMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueAniMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueCapMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueCapMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueTourMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueTourMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueEnvMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueEnvMax,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueOuvMin,10),
			strconv.FormatInt(room.ClassList[0].Preferences.ValueOuvMax,10))*/
		cmd := exec.Command("./bin/viabLabExe", file )
		//cmd := exec.Command("./bin/tmpexe")
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		if err := cmd.Start(); err != nil { //lancement de l'exe

		}

		//Boucle qui permet d'attendre la creation du fichier pour renver les datas.
		done := make(chan error, 1)
		go func() {
			done <-cmd.Wait()
		}()
		select {
		case err := <-done :

			if err != nil {

				MyExit(w, errors.New("err : "+err.Error()))
				return

			}
			var paramMv []string
			var pathOut = "./"+fileOut
			paramMv = append(paramMv,
				pathOut, "./www/sources/output")
			cmdMv := exec.Command("mv",paramMv... )

			cmdMv.Run()
			// supression du fichier inutile
			var paramRm []string
			var pathToRemove = "./"+fileToRemove
			paramRm = append(paramRm, pathToRemove)
			cmdRm := exec.Command("rm",paramRm... )
			cmdRm.Run()


			fmt.Printf("success \n")
			w.WriteHeader(http.StatusOK)

			fileOut := strings.Replace(fileOut, "input", "www/sources/output", -1)

			fo, err := os.Stat(fileOut);
			size := fo.Size()
			var alerte = " "
			if size == 0 {
				alerte = "Ce noyau est vide !"
			} else {
				data, err2 := ioutil.ReadFile(strings.Replace(fileOut, "input", "www/sources/output", -1))
				if err2 != nil {
					fmt.Println(err2)
				}
				var vals = strings.Split(string(data), " ")
				v1, err := strconv.ParseFloat(vals[1], 32)
				if err != nil {
					fmt.Println("v1")
					fmt.Println(err)
				}
				v2, err := strconv.ParseFloat(vals[3], 32)
				if err != nil {
					fmt.Println("v2")
					fmt.Println(err)
				}
				v3, err := strconv.ParseFloat(vals[5], 32)
				if err != nil {
					fmt.Println("v3")
					fmt.Println(err)
				}
				if (v1 < 0) || (v2 < 0) || (v3 < 0){
					alerte = "Ce noyau est vide !"
				}else{
					alerte = "Votre noyau n'est pas vide !"}
			}
			fmt.Fprint(w, alerte )
		}
		/*ticker :=time.NewTicker(time.Second*1)
		for range ticker.C {
			select {
			case err := <-done :

				if err != nil {

					MyExit(w, errors.New("err : "+err.Error()))
					return

				}
				var paramMv []string
				paramMv = append(paramMv,
					"./output/*", "./www/output")
				cmdMv := exec.Command("mv",paramMv... )
				cmdMv.Run()
				fmt.Printf("success \n")
				w.WriteHeader(http.StatusOK)
				fmt.Fprint(w, fileOut)
			case <-RCtx.Done():
				fmt.Println("Client has disconnected.")
			}
		}*/

	} else if IsInMap(param, "fct") && param["fct"][0] == "send_message" &&
		IsInMap(param, "data") &&
		len(param["data"][0]) > 0 {
		type Data struct {
			RoomName string `json:"room_name"`
			ClassId string `json:"class_id"`
			Message  string `json:"message"`
		}

		var data Data
		err := json.Unmarshal([]byte(param["data"][0]), &data)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		room := g.GetRoom(data.RoomName)
		fmt.Printf("room : %+v\n", room)
		classId, err := strconv.ParseInt(data.ClassId, 10, 64)
		class := g.getClassFromRoom(room, classId)
		room.MessageList = append(room.MessageList, Message{room.LastId() + 1, class.Name, time.Now().Format("15:04:05"),data.Message})
		fmt.Printf("room : %+v\n", room)
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

