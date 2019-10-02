package ws

import (
	"fmt"
)

type Message struct {
	Id int64
	ClassName string
	Date 		string
	Message  string
}

func (r *Room) LastId() (ret int64) {
	for i := 0; r.MessageList != nil && i < len(r.MessageList); i++ {
		if r.MessageList[i].Id > ret {
			ret = r.MessageList[i].Id
		}
	}
	return ret
}


func (r *Room) GetMessage(last int64) (ret []Message) {
	fmt.Printf("%+v \n", r)
	for i := 0; r.MessageList != nil && i < len(r.MessageList); i++ {
		if r.MessageList[i].Id > last {
			ret = append(ret, r.MessageList[i])
		}
	}
	return ret
}

