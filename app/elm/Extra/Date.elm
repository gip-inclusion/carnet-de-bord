module Extra.Date exposing (parisZone)

import Time
import TimeZone


parisZone : Time.Zone
parisZone =
    TimeZone.europe__paris ()
