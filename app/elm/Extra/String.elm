module Extra.String exposing (nonBreakableSpace)


nonBreakableSpace : String
nonBreakableSpace =
    String.fromChar nonbreakableSpaceChar


nonbreakableSpaceChar : Char
nonbreakableSpaceChar =
    '\u{00A0}'
