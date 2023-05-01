import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/clienteAxios';
import {useNavigate} from "react-router-dom"
import useAuth from '../hooks/useAuth.jsx'
import io from 'socket.io-client'
let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [ buscador, setBuscador] = useState(false)

    const {auth} = useAuth()

    const navigate = useNavigate()

    useEffect(()=>{
        const obtenerProyectos = async ()=>{
            try {
                // comprobar que haya token (autenticado)
                const token = localStorage.getItem("token")
                if(!token) return

                // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios("/proyectos", config)
                setProyectos(data);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const mostrarAlerta = alerta =>{
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    // agregar proyecto a db
    const submitProyecto = async proyecto =>{
        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto =>{
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            
            // sincronizar state con base de datos
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados);

            setAlerta({msg: "Proyecto Actualizado Correctamente", error:false})

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);
        } catch (error) {
            console.log(error);
        };
    }

    const nuevoProyecto = async proyecto =>{
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //proyecto es el obj que viene del formulario
            const {data} = await clienteAxios.post("/proyectos", proyecto, config)
            setAlerta({msg: "Proyecto Creado Correctamente", error:false})

            // agregar proyecto en tiempo real, evita consulta en base de datos
            setProyectos([...proyectos, data])

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        // id viene de params de la url leida en proyecto
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data);
        } catch (error) {
            navigate("/proyectos")
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }
        
        setCargando(false)
    }

    const eliminarProyecto = async id =>{
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
 
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

            // Sincronizar state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados);

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = ()=>{
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea =>{
        if(tarea.id){
            await editarTarea(tarea)
        }else{
            await crearTarea(tarea)
        }
    }
    
    const crearTarea = async tarea =>{
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/tareas`, tarea, config)
            
           
            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET IO
            socket.emit("nueva tarea", data)
        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async tarea =>{
        try {
            // comprobar que haya token (autenticado)
            const token = localStorage.getItem("token")
            if(!token) return

            // configuracion que espera el backend para el proyecto (autorizacion con bearer token)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            // sincronizar state con base de datos
            setAlerta({})
            setModalFormularioTarea(false)

            // socket
            socket.emit("actualizar tarea", data)
        } catch (error) {
            console.log(error);
        };
    }

    const handleModalEditarTarea = (tarea)=>{
        setTarea(tarea);
        setModalFormularioTarea(true)
    }
    
    const handleModalEliminarTarea = (tarea)=>{
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
 
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            // Sincronizar state
            setAlerta({msg: data.msg, error: false})
            
            setModalEliminarTarea(false)
            
            // socket
            socket.emit("eliminar tarea", tarea)
            
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async (email)=>{
        try {
            setCargando(true)
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config);
            setColaborador(data);
            setAlerta({})
        } catch (error) {
            setAlerta({msg: error.response.data.msg, error: true});
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email=>{
        try {
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            setAlerta({msg: data.msg, error: false})
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = colaborador =>{
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador);
    }

    const eliminarColaborador = async ()=>{
        try {
            const token = localStorage.getItem("token")
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
 
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);

            const proyectoActualizado = {...proyecto};
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setAlerta({msg: data.msg, error: false})
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
                
            }, 3000);
        } catch (error) {
            console.log(error.response);
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem("token")
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
 
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);
            
            setTarea({})
            setAlerta({})

            // socket
            socket.emit("cambiar estado", data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleBuscador = ()=>{
        setBuscador(!buscador)
    }

    // socket io
    const submitTareasProyecto = (tarea) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado);
    }

    const actualizarTareaProyecto = tarea =>{
        const proyectosActualizados = {...proyecto}
        proyectosActualizados.tareas = proyectosActualizados.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectosActualizados);
    }

    const cambiarEstadoTarea = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    } 

    const cerrarSesionProyectos = ()=>{
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }
    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {ProyectosProvider}

export default ProyectosContext