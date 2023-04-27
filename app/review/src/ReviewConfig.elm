module ReviewConfig exposing (config)

{-| Do not rename the ReviewConfig module or the config function, because
`elm-review` will look for these.

To add packages that contain rules, add them to this review project using

    `elm install author/packagename`

when inside the directory containing this file.

-}

import NoDebug.Log
import NoDebug.TodoOrToString
import NoDeprecated
import NoExposingEverything
import NoImportingEverything
import NoInconsistentAliases
import NoMissingSubscriptionsCall
import NoMissingTypeAnnotation
import NoMissingTypeExpose
import NoModuleOnExposedNames
import NoPrematureLetComputation
import NoSimpleLetBody
import NoUnnecessaryTrailingUnderscore
import NoUnoptimizedRecursion
import NoUnused.CustomTypeConstructorArgs
import NoUnused.CustomTypeConstructors
import NoUnused.Dependencies
import NoUnused.Exports
import NoUnused.Parameters
import NoUnused.Patterns
import NoUnused.Variables
import NoUrlStringConcatenation
import NoUselessSubscriptions
import Review.Rule exposing (Rule)
import Simplify
import HtmlToElm


config : List Rule
config =
    commonBestPractices
        ++ noUnused
        ++ elmArchitecture
        ++ noDebug
        ++ [ Simplify.rule Simplify.defaults
           , NoUnoptimizedRecursion.rule (NoUnoptimizedRecursion.optOutWithComment "IGNORE TCO")
           , NoUrlStringConcatenation.rule
                |> Review.Rule.ignoreErrorsForDirectories [ "tests/" ]
           , NoUnnecessaryTrailingUnderscore.rule
           , NoSimpleLetBody.rule
           , NoInconsistentAliases.config
                [ ( "Json.Decode", "Decode" )
                , ( "Json.Encode", "Json" )
                , ( "Html.Attributes", "Attr" )
                , ( "Html.Events", "Evts" )
                ]
                |> NoInconsistentAliases.noMissingAliases
                |> NoInconsistentAliases.rule
           , NoModuleOnExposedNames.rule
           , HtmlToElm.rule
           ]


commonBestPractices : List Rule
commonBestPractices =
    [ NoExposingEverything.rule
        |> Review.Rule.ignoreErrorsForDirectories [ "tests" ]
    , NoDeprecated.rule NoDeprecated.defaults
    , NoImportingEverything.rule []
        |> Review.Rule.ignoreErrorsForDirectories [ "tests" ]
    , NoMissingTypeAnnotation.rule
    , NoMissingTypeExpose.rule
    , NoPrematureLetComputation.rule
    ]


noUnused : List Rule
noUnused =
    [ NoUnused.CustomTypeConstructors.rule []
    , NoUnused.CustomTypeConstructorArgs.rule
    , NoUnused.Dependencies.rule
    , NoUnused.Exports.rule
    , NoUnused.Parameters.rule
    , NoUnused.Patterns.rule
    , NoUnused.Variables.rule
    ]


elmArchitecture : List Rule
elmArchitecture =
    [ NoMissingSubscriptionsCall.rule
    , NoUselessSubscriptions.rule
    ]


noDebug : List Rule
noDebug =
    [ NoDebug.Log.rule
    , NoDebug.TodoOrToString.rule
        |> Review.Rule.ignoreErrorsForDirectories [ "tests/" ]
    ]
