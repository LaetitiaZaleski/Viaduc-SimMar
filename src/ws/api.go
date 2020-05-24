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
	}else if strings.Compare(fnct, "get_recap_preference") == 0 &&
		IsInMap(param, "file_name"){

		filename := "input/"+param["file_name"][0]

		type Json struct {
			Settings Settings `json:"settings"`
			Preferences Preferences `json:"preferences"`
		}

		var preference Preferences

		file, _ := ioutil.ReadFile(filename)

		var data Json
		log.Println(fmt.Sprintf("%s \n", filename))

		err := json.Unmarshal([]byte(file), &data)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		log.Println(fmt.Sprintf(" %v", data))
		preference = data.Preferences

		json,err := json.Marshal(preference)
		if err != nil {
			MyExit(w, err)
			return
		}
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, string(json))

	}else if strings.Compare(fnct, "save_for_conclu") == 0 {

	} else if strings.Compare(fnct, "rename_file") == 0 {
		log.Println(fmt.Sprintf("nom ok"))
		if IsInMap(param, "room_name") {
			log.Println(fmt.Sprintf("room_name"))
		}
		if IsInMap(param, "class_id") {
			log.Println(fmt.Sprintf("class_id"))
		}
		if IsInMap(param, "last_id") {
			log.Println(fmt.Sprintf("last_id"))
		}
		if IsInMap(param, "file_id") {
			log.Println(fmt.Sprintf("file_id"))
		}

		// supression du fichier inutile

		roomName := param["room_name"][0]
		classId := param["class_id"][0]
		fileId := param["file_id"][0]
		log.Println(fmt.Sprintf("%v", fileId))
		lastId, _ := strconv.Atoi(param["last_id"][0])
		lastId = lastId + 1
		var newId= strconv.Itoa(lastId)
		log.Println(fmt.Sprintf("%v", lastId))
		//var fileViabToRename = "www/sources/output/" + roomName + "_" + classId + "_" + fileId + "-viab-0-bound.dat"
		var fileViabToRename = "www/sources/output/" + roomName + "_" + classId + "_" + fileId + "-viab-0.dat"
		var fileViabNewName = strings.Replace(fileViabToRename, fileId, newId, -1)
		var fileJsonToRename = "input/" + roomName + "_" + classId + "_" + fileId + ".json"
		//var fileJsonToRename = "input/" + roomName + "_" + classId + "_" + fileId + ".json"
		var fileJsonNewName = strings.Replace(fileJsonToRename, fileId, newId, -1)
		var paramCp []string
		var pathViabToRename = "./" + fileViabToRename
		log.Println(fmt.Sprintf(fileViabToRename))
		var pathJsonToRename = "./" + fileJsonToRename
		paramViabCp := append(paramCp, pathViabToRename, fileViabNewName)
		paramJsonCp := append(paramCp, pathJsonToRename, fileJsonNewName)

		if fileId != param["last_id"][0]{

		cmdCp := exec.Command("cp", paramViabCp...)
		errCp := cmdCp.Run()
		if (errCp != nil) {
			fmt.Println(errCp)
		}
		cmdCp = exec.Command("cp", paramJsonCp...)
		cmdCp.Run()
		}
		// fichier pour montrer qu'on a fini :

		//var fileFinish = strings.Replace(fileViabToRename, fileId +"-viab-0-bound", "finalfile", -1)
		var fileFinish = strings.Replace(fileViabToRename, fileId +"-viab-0", "finalfile", -1)
		if (param["bool_finalfile"][0]=="false"){
			 fileFinish = strings.Replace(fileViabToRename, fileId +"-viab-0", "unused", -1)
		}
		log.Println(fmt.Sprintf(fileFinish))
		paramFinish := append(paramCp, pathViabToRename,fileFinish)
		cmdCpF := exec.Command("cp", paramFinish...)
		cmdCpF.Run()


		/****************/
	}else if strings.Compare(fnct, "delete_finalFile") == 0 {
		roomName := param["room_name"][0]
		classId := param["class_id"][0]
		filename := "www/sources/output/" + roomName +"_"+classId+ "_finalfile.dat"
		cmdDeleteFF := exec.Command("rm", filename)
		cmdDeleteFF.Run()
	}else if strings.Compare(fnct, "create_wait") == 0  && IsInMap(param, "room_name") {
		g.GetRoom(param["room_name"][0]).Wait = true
	} else if strings.Compare(fnct, "get_final_pref") == 0 && IsInMap(param, "room_name") {

		room := g.GetRoom(param["room_name"][0])
		if room.Wait {
			ticker := time.NewTicker(500 * time.Millisecond)
				for range ticker.C {
					room = g.GetRoom(param["room_name"][0])
					if room.Wait == false {
						break
					}
				}
		}
		type tmp struct {
			FinalPrefs []string `json:"final_pref"`
			NumFile []int `json:"num_file"`
		}

		res := tmp{}

		res.FinalPrefs = room.FinalPrefs
		res.NumFile = room.NumFile

		MyJson,err := json.Marshal(res)
		if err != nil {
			MyExit(w, err)
			return
		}

		w.WriteHeader(http.StatusOK)
		io.WriteString(w, string(MyJson))

	}else if strings.Compare(fnct, "create_empty_file") == 0 {
		roomName := param["room_name"][0]
		id := param["id"][0]
		numFile := param["num_file"][0]
		filename := "input/" + roomName +"_"+id+"_"+ numFile+".json"
		cmdCreateEmptyJson := exec.Command("touch",filename)
		cmdCreateEmptyJson.Run()
		filenameKernel := "www/sources/output/" + roomName +"_"+id+"_"+ numFile+"-viab-0.dat"
		//filenameKernel := "www/sources/output/" + roomName +"_"+id+"_"+ numFile+"-viab-0.dat"
		cmdCreateEmptyKernel := exec.Command("touch",filenameKernel)
		cmdCreateEmptyKernel.Run()
	} else if strings.Compare(fnct, "create_end") == 0 {
		roomName := param["room_name"][0]
		filename := "www/sources/output/" + roomName + "_end.txt"
		cmdCreateEnd := exec.Command("touch",filename)
		cmdCreateEnd.Run()
	}else if strings.Compare(fnct, "delete_end") == 0 {
		roomName := param["room_name"][0]
		filename := "www/sources/output/" + roomName + "_end.txt"
		cmdDeleteWait := exec.Command("rm", filename)
		cmdDeleteWait.Run()
	}else if strings.Compare(fnct, "test") == 0 {
		ret := SendPostRequest("http://localhost:8883/job","pi.tgz","file")
		log.Println(fmt.Sprintf(string(ret)))

	} else {
		fmt.Printf("%+v\n", param)
		MyExit(w, errors.New("wrong format GET"))
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
		fileOut := strings.Replace(file, ".json", "-viab-0.dat", -1)
		//fileOut := strings.Replace(file, ".json", "-viab-0-bound.dat", -1)
		//var fileToRemove = strings.Replace(file, ".json", "-viab-0.dat", -1)
		var fileToRemove = strings.Replace(file, ".json", "-viab-0-bound.dat", -1)
		//cmd := exec.Command("./bin/viabLabExe1", file )
		cmd := exec.Command("./bin/viabLabExeTest2", file )
		//cmd := exec.Command("./bin/tmpexe")
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		if err := cmd.Start(); err != nil { //lancement de l'exe

		}

		//Boucle qui permet d'attendre la creation du fichier pour renvoyer les datas.
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

			var alerte = " "

			boolEmpty := isKernelEmpty(fileOut)

			if boolEmpty {
				alerte = "Ce noyau est vide !"
			} else {
			/*	data, err2 := ioutil.ReadFile(strings.Replace(fileOut, "input", "www/sources/output", -1))
				if err2 != nil {
					fmt.Println(err2)
				}
				var vals = strings.Split(string(data), " ")
				v1, err := strconv.ParseFloat(vals[1], 32)

				if err != nil {
					fmt.Println("v1")
					fmt.Println(err)
				}else {
					fmt.Println("v1")
					fmt.Println(v1)
				}
				v2, err := strconv.ParseFloat(vals[3], 32)
				if err != nil {
					fmt.Println("v2")
					fmt.Println(err)
				}else {
					fmt.Println("v2")
					fmt.Println(v2)
				}
				v3, err := strconv.ParseFloat(vals[5], 32)
				if err != nil {
					fmt.Println("v3")
					fmt.Println(err)
				}else {
					fmt.Println("v3")
					fmt.Println(v3)
				}
				if (v1 < 0) || (v2 < 0) || (v3 < 0) || (v1 > 50000) || (v2 > 50000) || (v3 > 50000){
					alerte = "Ce noyau est negatif !"
				}else{ */
					alerte = "Votre noyau n'est pas vide !"
				//}

			}
			fmt.Fprint(w, alerte )
		}


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
		//fileOut := strings.Replace(file, ".json","-viab-0.dat" , -1)
		var fileToRemove = strings.Replace(file, ".json", "-viab-0.dat", -1)
		//var fileToRemove = strings.Replace(file, ".json", "-viab-0-bound.dat", -1)
		log.Println(file)
		//cmd := exec.Command("./bin/viabLabExe1", file )
		cmd := exec.Command("./bin/viabLabExeTest2", file )
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
				}else {
					fmt.Println("v1")
					fmt.Println(v1)
				}
				v2, err := strconv.ParseFloat(vals[3], 32)
				if err != nil {
					fmt.Println("v2")
					fmt.Println(err)
				}else {
					fmt.Println("v2")
					fmt.Println(v2)
				}
				v3, err := strconv.ParseFloat(vals[5], 32)
				if err != nil {
					fmt.Println("v3")
					fmt.Println(err)
				}else {
					fmt.Println("v3")
					fmt.Println(v3)
				}
				if (v1 < 0) || (v2 < 0) || (v3 < 0) || (v1 > 50000) || (v2 > 50000) || (v3 > 50000){
					alerte = "Ce noyau est negatif !"
				}else{
					alerte = "Votre noyau n'est pas vide !"
				}
			}
			fmt.Fprint(w, alerte )
		}

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
	}  else if IsInMap(param, "fct") && param["fct"][0] =="set_final_pref" && IsInMap(param, "data") {
		fmt.Printf("DATA FINAL PREF = %+v\n",param["data"][0])
		type Data struct {
			RoomName string `json:"room_name"`
			FinalPref  []string `json:"final_pref"`
		}
		var data Data
		err := json.Unmarshal([]byte(param["data"][0]), &data)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		fmt.Printf("FINAL PREF = %+v\n",data.FinalPref)
		room := g.GetRoom(data.RoomName)
		room.FinalPrefs = data.FinalPref
		room.Wait = false
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok")

	}else if IsInMap(param, "fct") && param["fct"][0] =="set_num_file" && IsInMap(param, "data2") {
		log.Println(fmt.Sprintf("DATA NUM FILE  = %+v\n",param["data2"][0]))
		type Data struct {
			RoomName string `json:"room_name"`
			NumFile  []int `json:"num_file"`
		}
		var data Data
		err := json.Unmarshal([]byte(param["data2"][0]), &data)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		room := g.GetRoom(data.RoomName)
		room.NumFile = data.NumFile
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok")

	}else if IsInMap(param, "fct") && param["fct"][0] == "lets_setPref" &&
		IsInMap(param, "fp") &&
		IsInMap(param, "room_name") &&
		IsInMap(param, "classId") {
		roomName := param["room_name"][0]
		id := param["classId"][0]
		fp := param["fp"][0]
		filename := "input/" + roomName +"_"+id+"_"+ fp+".json"

		type Json struct {
			Settings Settings `json:"settings"`
			Preferences Preferences `json:"preferences"`
		}

		var preference Preferences

		file, _ := ioutil.ReadFile(filename)

		var data Json



		log.Println(fmt.Sprintf("reset les params \n"))

		log.Println(fmt.Sprintf("%s \n", filename))

		err := json.Unmarshal([]byte(file), &data)
		if err != nil {
			log.Println(fmt.Sprintf("JSON Data problem. current var : %v\nerr: %v", param, err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		log.Println(fmt.Sprintf(" %v", data))
		preference = data.Preferences

		classId, err1 := strconv.ParseInt(preference.ClassId, 10, 64)
		if err1 != nil {
			log.Println(fmt.Sprintf("ERREUR 1 !!"))
		}
		room := g.GetRoom(preference.RoomName)

		class := g.getClassFromRoom(room, classId)
		class.Preferences = preference

		log.Println(fmt.Sprintf("preferences : %v \n", preference))
		log.Println(fmt.Sprintf("classID : %v \n", classId))
		log.Println(fmt.Sprintf("Settings : %v \n", class.Settings))
	}		else {
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

