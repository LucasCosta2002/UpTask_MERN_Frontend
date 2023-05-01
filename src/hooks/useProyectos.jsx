import { useContext } from "react";
import ProyectosContext from "../context/ProyectosProvider";

const useProyectos = ()=>{
    //useContext extrae datos de ProyectosContext
    return useContext(ProyectosContext)
}

export default useProyectos