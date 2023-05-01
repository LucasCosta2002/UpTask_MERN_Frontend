import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = ()=>{
    //useContext extrae datos de authcontext
    return useContext(AuthContext)
}

export default useAuth