package client

import (
	"encoding/json"
	"log"

	"gosrc.io/xmpp/stanza"
)

type IncommingMessage struct {
	Type    stanza.StanzaType      `json:"type" binding:"required"`
	Payload map[string]interface{} `json:"payload" binding:"required"`
}

func (c *Client) handleWebsocketMessage(message []byte) {
	var msg IncommingMessage
	err := json.Unmarshal(message, &msg)
	// is chat message
	if err != nil {
		log.Println(err)
	}

	// generate XMPP stanza
	// var m stanza.Message
	if msg.Type == stanza.PresenceTypeSubscribed {
		to, ok := msg.Payload["to"].(string)
		if !ok {
			log.Println("unable to parse Presence payload")
		}
		m := stanza.Presence{Attrs: stanza.Attrs{
			To: to, From: "admin@localhost", Type: stanza.PresenceTypeSubscribed}}
		c.XMPPClient.Send(m)
	}

	// send generated XMPP message
}