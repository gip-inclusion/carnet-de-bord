module Effect exposing (Atomic(..), Effect(..), batch, fromCmd, map, none, now, perform)

import Task
import Time


type Effect msg
    = Atomic (Atomic msg)
    | Batch (List (Atomic msg))


type Atomic msg
    = None
    | FromCmd (Cmd msg)
    | Now (Time.Posix -> msg)


batch : List (Effect a) -> Effect a
batch effects =
    effects
        |> List.concatMap
            (\effect ->
                case effect of
                    Atomic atomic ->
                        [ atomic ]

                    Batch atomics ->
                        atomics
            )
        |> Batch


map : (a -> b) -> Effect a -> Effect b
map mapFunction effect =
    case effect of
        Atomic atomic ->
            Atomic <| mapAtomic mapFunction atomic

        Batch atomics ->
            atomics |> List.map (mapAtomic mapFunction) |> Batch


mapAtomic : (a -> b) -> Atomic a -> Atomic b
mapAtomic toB effect =
    case effect of
        None ->
            None

        FromCmd command ->
            FromCmd <| Cmd.map toB command

        Now msg ->
            Now (msg >> toB)


none : Effect msg
none =
    Atomic None


now : (Time.Posix -> msg) -> Effect msg
now =
    Atomic << Now


fromCmd : Cmd msg -> Effect msg
fromCmd =
    Atomic << FromCmd



-- Handle


perform : Effect msg -> Cmd msg
perform effect =
    case effect of
        Atomic atomic ->
            performAtomic atomic

        Batch atomics ->
            atomics |> List.map performAtomic |> Cmd.batch


performAtomic : Atomic msg -> Cmd msg
performAtomic effect =
    case effect of
        None ->
            Cmd.none

        FromCmd command ->
            command

        Now msg ->
            Task.perform msg Time.now
