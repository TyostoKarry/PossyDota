# PossyDota

**Simple Discord bot for Dota 2 utilizing OpenDota API.**

## Commands:

### `!help`

Displays available commands and their usage.

### `!link [Steam32ID]`

Links your Discord account to a Steam32 ID.

### `!unlink`

Deletes the linked Steam32 ID from the Discord account.

### `!lastmatch [match] [@user]` or `!lm [match] [@user]`

Displays basic info of the last match with a Dotabuff link to the given match.  
Usage examples:

- `!lastmatch` - Shows info for the user's last match.
- `!lastmatch 3` - Shows info for the user's 3rd last match.
- `!lastmatch @friend` - Shows info for the linked friend's last match.

### `!matchhistory [@user]` or `!mh [@user]`

Lists player stats and Dotabuff links of the 5 most recent games.  
Usage examples:

- `!matchhistory` - Shows match history for the user.
- `!matchhistory @friend` - Shows match history for the linked friend.

### `!mmr [match count] [@user]`

Displays a graph of MMR gain or loss during the 10 most recent ranked games.  
Usage examples:

- `!mmr` - Shows MMR graph for the user's last 10 games.
- `!mmr all` - Shows MMR graph for all valid games.
- `!mmr 5 @friend` - Shows MMR graph for the linked friend's last 5 games.

### `!matchcount [@user]` or `!mc [@user]`

Displays a bar chart of the player's game count in the past week.  
Usage examples:

- `!matchcount` - Shows game count chart for the user.
- `!matchcount @friend` - Shows game count chart for the linked friend.

### `!smurfs` or `!s`

Displays ranks and games played of all the players in the previous match.

### `!lastupdate` or `!lu`

Displays the most recent news post.

### `!setnewschannel` or `!snc`

Sets the channel that the command was sent from as the channel for news posts.
