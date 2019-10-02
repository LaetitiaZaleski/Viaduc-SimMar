package ws

import "time"

type Message struct {
	Id int64
	ClassName string
	Date 		time.Time
	Message  string
}

func (r *Room) LastId() (ret int64) {
	for i := 0; i < len(r.MessageList); i++ {
		if r.MessageList[i].Id > ret {
			ret = r.MessageList[i].Id
		}
	}
	return ret
}


func (r *Room) getMessage(last int64) (ret []Message) {
	for i := 0; i < len(r.MessageList); i++ {
		if r.MessageList[i].Id > last {
			ret = append(ret, r.MessageList[i])
		}
	}
	return ret
}

