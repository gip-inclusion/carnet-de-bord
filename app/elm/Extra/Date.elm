module Extra.Date exposing (parseTimestamp, print)

import Date exposing (Date)


print : Date -> String
print date =
    Date.format "dd/MM/YYYY" date


parseTimestamp : String -> Result String Date
parseTimestamp =
    String.split "T"
        >> List.head
        >> Result.fromMaybe "Le format attendu est un datetime au format ISO"
        >> Result.andThen Date.fromIsoString
