# Network protocol of OpenClubPenguin

<pre>
    <code>
 +---------+                    +---------+                +-----------+
 |         |                    |         |                |           |
 | CLIENT  |                    | SERVER  |                | BROADCAST |
 |         |                    |         |                |           |
 +---------+                    +---------+                +-----------+
     |                                |                          |
     |                                |                          |
     |                                |                          |
     |------ websocket connect ------>|                          |
     |<----- <a href="../src/shared/messages/server/startinfo.ts">startinfo</a> ---------------|----- <a href="../src/shared/messages/server/playerinfo.ts">playerinfos</a> ------->|
     |                                |                          |
     |                                |                          |
     |                                |----- <a href="../src/shared/messages/server/update.ts">update</a> ------------>|
     |                                |   (fixed interval)       |
     |                                |                          |
     |------ <a href="../src/shared/messages/client/move.ts">move</a> ------------------->|                          |
     |    (on user input)             |                          |
     |                                |                          |
     |------ <a href="../src/shared/messages/client/username.ts">username</a> --------------->|----- <a href="../src/shared/messages/server/playerinfo.ts">playerinfos</a> ------->|
     |                                |                          |
     |                                |                          |
     |------ websocket disconnect --->|                          |
     |                                |                          |
     |                                |                          |
    </code>
</pre>
