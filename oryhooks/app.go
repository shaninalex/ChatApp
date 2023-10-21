package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
)

var (
	// Need to figure out what scope require for user to full iteract with each other.
	// direct messages, find users, create room, friendship requests etc...
	// For now it's just all scope from "muc_room" https://docs.ejabberd.im/developer/ejabberd-api/admin-tags/#muc-room
	DEFAULT_USER_SCOPE = "change_room_option;create_room;create_room_with_opts;destroy_room;get_room_affiliation;get_room_affiliations;get_room_history;get_room_occupants;get_room_occupants_number;get_room_options;get_subscribers;send_direct_invitation;set_room_affiliation;subscribe_room;subscribe_room_many;unsubscribe_room"
)

type OryHooks struct {
	EjabberdRoot  string
	AdminJID      string
	AdminPassword string
	TokenLifeTime int64
}

func InitOryHooks() *OryHooks {
	return &OryHooks{
		EjabberdRoot:  os.Getenv("EJABBERD_ROOT"),
		AdminJID:      os.Getenv("ADMIN_JID"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
		TokenLifeTime: 3600,
	}
}

func (o *OryHooks) Register(payload *RegistrationPayload) error {
	client := http.Client{}

	ejabberd_payload := strings.NewReader(
		fmt.Sprintf(`{"user": "%s","host": "%s","password": "%s"}`,
			payload.UserId,
			"localhost",
			uuid.New().String(), // users will never be able to login via password. Only Auth token
		),
	)
	request, err := http.NewRequest("POST", fmt.Sprintf("%s/api/register", o.EjabberdRoot), ejabberd_payload)
	if err != nil {
		return err
	}
	resp, err := client.Do(request)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(request.Body)
	if err != nil {
		return err
	}
	log.Println(string(data))

	return nil
}

func (o *OryHooks) AuthToken(payload *RegistrationPayload) error {
	client := http.Client{}
	ejabberd_payload := strings.NewReader(
		fmt.Sprintf(`{"jid": "%s","ttl": "%d","scopes": "%s"}`,
			payload.UserId,
			o.TokenLifeTime,
			DEFAULT_USER_SCOPE,
		),
	)
	request, err := http.NewRequest("POST", fmt.Sprintf("%s/api/oauth_issue_token", o.EjabberdRoot), ejabberd_payload)
	if err != nil {
		return err
	}
	resp, err := client.Do(request)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(request.Body)
	if err != nil {
		return err
	}
	log.Println(string(data))

	return nil
}
