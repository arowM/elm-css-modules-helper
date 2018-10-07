module Css exposing
    ( Css(..)
    , class
    , classList
    )

import Html exposing (Attribute)
import Html.Attributes as Attributes

type Css
    = Layout
    | Input
    | Label
    | App


prefix : String
prefix =
    "_elm_css_modules_sample_"


cssPrefix : Css -> String
cssPrefix css =
    case css of
        Layout ->
            "layout__"

        Input ->
            "input__"

        Label ->
            "label__"

        App ->
            "app__"


className : Css -> String -> String
className css name =
    prefix ++ cssPrefix css ++ name


class : Css -> String -> Attribute msg
class css name =
    Attributes.class <| className css name


classList : Css -> List ( String, Bool ) -> Attribute msg
classList css ls =
    Attributes.classList <|
        List.map (Tuple.mapFirst (className css)) ls
