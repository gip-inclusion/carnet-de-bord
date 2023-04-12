module Extra.Date exposing (fromPosix, print)

import Date exposing (Date)
import Time
import TimeZone


parisZone : Time.Zone
parisZone =
    TimeZone.europe__paris ()


fromPosix : Time.Posix -> Date
fromPosix =
    Date.fromPosix parisZone


print : Date -> String
print date =
    Date.format "dd/MM/YYYY" date
