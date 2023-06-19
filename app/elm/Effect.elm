module Effect exposing (Atomic(..), Effect(..), fromCmd, map, none, perform)


type Effect msg
    = Atomic (Atomic msg)


type Atomic msg
    = None
    | FromCmd (Cmd msg)


batch : List (Effect a) -> Effect a
batch effects =
    --no-idea



map : (a -> b) -> Effect a -> Effect b
map f effect =
    case effect of
        Atomic atomic ->
            Atomic <| mapAtomic f atomic


mapAtomic : (a -> b) -> Atomic a -> Atomic b
mapAtomic f effect =
    case effect of
        None ->
            None

        FromCmd command ->
            FromCmd <| Cmd.map f command


none : Effect msg
none =
    Atomic None


fromCmd : Cmd msg -> Effect msg
fromCmd =
    Atomic << FromCmd



-- Handle


perform : Effect msg -> Cmd msg
perform effect =
    case effect of
        Atomic atomic ->
            performAtomic atomic


performAtomic : Atomic msg -> Cmd msg
performAtomic effect =
    case effect of
        None ->
            Cmd.none

        FromCmd command ->
            command
