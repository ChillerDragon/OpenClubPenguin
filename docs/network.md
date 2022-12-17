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
     |<----- <a href="../src/shared/messages/startinfo.ts">startinfo</a> ---------------|----- playerinfos ------->|
     |                                |                          |
     |                                |                          |
     |                                |----- update ------------>|
     |                                |   (fixed interval)       |
     |                                |                          |
     |------ move ------------------->|                          |
     |    (on user input)             |                          |
     |                                |                          |
     |------ username --------------->|----- playerinfos ------->|
     |                                |                          |
     |                                |                          |
     |------ websocket disconnect --->|                          |
     |                                |                          |
     |                                |                          |
    </code>
</pre>
