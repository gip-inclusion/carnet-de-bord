module Extra.Date exposing (fromPosix, parseTimestamp, print)

import Date exposing (Date)
import Time
import TimeZone


fromPosix : Time.Posix -> Date
fromPosix =
    Date.fromPosix (TimeZone.europe__paris ())


print : Date -> String
print date =
    Date.format "dd/MM/YYYY" date


parseTimestamp : String -> Result String Date
parseTimestamp =
    String.split "T"
        >> List.head
        >> Result.fromMaybe "Le format attendu est un datetime au format ISO"
        >> Result.andThen Date.fromIsoString
