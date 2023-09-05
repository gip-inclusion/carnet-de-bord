module Extra.String exposing (capitalize, nonBreakableSpace)


capitalize : String -> String
capitalize lower =
    case String.uncons lower of
        Just ( first, rest ) ->
            String.cons (first |> Char.toUpper) (String.toLower rest)

        Nothing ->
            lower


nonBreakableSpace : String
nonBreakableSpace =
    String.fromChar nonbreakableSpaceChar


nonbreakableSpaceChar : Char
nonbreakableSpaceChar =
    '\u{00A0}'
