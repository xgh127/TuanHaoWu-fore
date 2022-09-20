import {useNavigate, useParams, useLocation} from "react-router-dom";
import React from "react";

export const withNavigation = (Component) => {
    return (props) => <Component {...props} params={useParams()} navigate={useNavigate()} location={useLocation()}/>;
}
