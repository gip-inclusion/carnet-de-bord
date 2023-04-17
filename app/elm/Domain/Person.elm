module Domain.Person exposing (Person, printNom)


type alias Person =
    { id : String
    , lastName : String
    , firstName : String
    , email : String
    }


printNom : Person -> String
printNom personne =
    personne.firstName ++ " " ++ String.toUpper personne.lastName
