module Extra.Date exposing (print)

import Date exposing (Date)


print : Date -> String
print date =
    Date.format "dd/MM/YYYY" date
