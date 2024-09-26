## v1.4.6 (2024-09-26)

### Fix

- **client**: new ui #62
- **client**: (UI) chat menu #62
- **client**: (UI) conversation list and area #62
- **client**: change layout #62
- **client**: Xmpp events distribution service and user subscription ( contacts ) component #62
- **client**: refactor ui #62
- **client**: do not show private messages in group chat
- **backend**: set affiliation member for new user

### Refactor

- **client**: reduced folder nesting #62

## v1.4.5 (2024-09-21)

### Fix

- **backend**: generate unique nickname [close] #58
- **backend**: add nickname to user traits #58

## v1.4.4 (2024-09-19)

### Fix

- **client**: participants list and layout #55
- **client**: message observables and sender form
- **client**: chat status line
- **client**: conversation layout #55

## v1.4.3 (2024-09-14)

### Fix

- **client**: join room, show participants, show messages
- **client**: get online rooms information and storing them in ngrx

### Refactor

- **client**: xmpp service and ngrx loadIdentity effect

## v1.4.2 (2024-09-11)

### Fix

- **client**: settings form tabs [close] #46
- **backend**: remove idea with nickname in identity traits #45
- **backend**: validate user nickname on register and assign as an ejabberd nickname #45
- **backend**: register hooks handlers functions

## v1.4.1 (2024-09-09)

### Fix

- **client**: check notification pubsub node
- **client**: move xmpp client to client application since handlers on client and admin will be different anyways

## v1.4.0 (2024-09-08)

### Feat

- **schema**: adding user nickname to kratos schema
- **client**: basic layout
- **client**: ngrx
- **xmpp**: create lobby and add user to lobby on register methods
- **api**: add auth controller

### Fix

- **client**: connect to xmpp
- registration pricess
- **backend**: register user with ejabberd user creation process
- **client**: move to module based application instead of standalone
- **config**: update server example configuration

## v1.3.0 (2024-09-07)

### Feat

- **develop**: setup docker config for local development

### Fix

- **server**: connect application to infrastructure

## v1.2.0 (2024-05-28)

### Feat

- appruve sub
- add ngrx entity
- handle more specific events in service
- send message to selected user
- save user image into ejabberd vcard
- hide ejabberd websocket under the oathkeeper api gateway
- simplify vcard
- select conversation by jid
- add release workflow
- making types for messages
- making auth pages
- start making fronted
- auth middleware and save user to Context
- create jwt token
- setup app routes and basic db

### Fix

- Chat redux
- update regular registration jsonnet payload
- save vcard to redux contact item
- add store devtools module
- redux and remove typedefs folder
- move identity store to root reducer
- remove redux despatch on xmpp service
- add permission to workflow
- release workflow
- release workflow
- use env variables
