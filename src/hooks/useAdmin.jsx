import useAuth from "./useAuth";
import useProyectos from "./useProyectos";

const useAdmin = ()=>{
    const{ proyecto} = useProyectos()
    const {auth} = useAuth()


    // si el creador es el mismo que inicio sesion, es admin
    return proyecto.creador === auth._id 
}

export default useAdmin