# PossyDota

Discord bot for Dota2. Uses OpenDota API.

Commands:

!help:
Displays commands to use.

!link Steam32ID:
Links your discord account to a Steam32 ID.

!unlink:
Deletes linked Steam32 ID from discord account.

!lastmatch [match] [@user] or !lm [match] [@user]:
Displays basic info of last match with dotabuff link to given match. Can be given game number as parameter to display that most recent match. Can also be given another linked player as a parameter for their last match.

!matchhistory [@user] or !mh [@user]:
Lists players stats and dotabuff links of 5 most recent games. Can access specific game from the dropdown menu. Can be given another linked player as a parameter.

!mmr [match count] [@user]:
Displays of a graph of a mmr gain or loss during the 10 most recent ranked games. Can be given match count as parameter. Parameter 'all' displays all valid games. Can also be given another linked player as a parameter for their mmr graph.

!matchcount [@user] or !mc [@user]:
Displays of a bar chart of the players game count in the past week. Can also be given another linked player as a parameter for their game count chart.

!smurfs or !s:
Displays ranks and games played of all the players in current match.
