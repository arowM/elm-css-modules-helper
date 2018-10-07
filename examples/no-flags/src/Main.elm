module Main exposing (main)

{-| This sample app shows how to use CSS modules in Elm without hack.
Without using `arowM/elm-html-with-context`, it is needed to pass `style` value explicitly to almost all view functions.
See `examples/real-world` to check how it uses `elm-html-with-context` to pass such contexts to all view functions implicitly.
-}

import Browser
import Css exposing (Css, class)
import Html exposing (Attribute, Html)
import Html.Attributes as Attributes
import Html.Events as Events
import Html.Lazy as Html
import Json.Decode as Decode exposing (Decoder, Value)



-- APP


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Model


type alias Model =
    { inputBox1 : Maybe String
    , inputBox2 : Maybe String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { inputBox1 = Nothing
      , inputBox2 = Nothing
      }
    , Cmd.none
    )



-- Update


type Msg
    = OnInputInputBox1 String
    | OnInputInputBox2 String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnInputInputBox1 str ->
            ( { model
                | inputBox1 = Just str
              }
            , Cmd.none
            )

        OnInputInputBox2 str ->
            ( { model
                | inputBox2 = Just str
              }
            , Cmd.none
            )



-- View


view : Model -> Html Msg
view model =
    wrap
        [ inputRow "item 1" OnInputInputBox1 model.inputBox1
        , inputRow "item 2" OnInputInputBox2 model.inputBox2
        ]



-- Molecular view


inputRow : String -> (String -> Msg) -> Maybe String -> Html Msg
inputRow name onInput val =
    wrap
        [ Html.div
            [ class Css.App "inputRow"
            , class Css.Layout "row"
            , class Css.Layout "alignCenter"
            ]
            [ label name
            , expanded
                [ input onInput val
                ]
            ]
        ]



-- Atomic views


label : String -> Html Msg
label str =
    wrap
        [ Html.lazy label_ str
        ]


label_ : String -> Html Msg
label_ str =
    Debug.log "label_ was called" <|
        Html.div
            [ class Css.Label "default"
            ]
            [ Html.text str
            ]


input : (String -> Msg) -> Maybe String -> Html Msg
input onInput val =
    wrap
        [ Html.lazy2 input_ onInput val
        ]


input_ : (String -> Msg) -> Maybe String -> Html Msg
input_ onInput val =
    Debug.log "input_ was called" <|
        Html.input
            [ class Css.Input "default"
            , Attributes.type_ "text"
            , Attributes.value <| Maybe.withDefault "" val
            , Events.onInput onInput
            ]
            []



-- Layout functions


layout : String ->  List (Html Msg) -> Html Msg
layout key =
    Html.div
        [ class Css.Layout key
        ]


wrap : List (Html Msg) -> Html Msg
wrap =
    layout "wrap"


expanded : List (Html Msg) -> Html Msg
expanded =
    layout "expanded"



-- Subscription


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
