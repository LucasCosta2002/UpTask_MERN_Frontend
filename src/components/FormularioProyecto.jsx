import { useState, useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"
import { useParams } from 'react-router-dom'

const FormularioProyecto = () => {

    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos()
    const params = useParams()

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')
    const [id, setId] = useState(null)

    useEffect(()=>{
        if(params.id){
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
            setId(proyecto._id)
        }
    },[params])

    const handleSubmit = async e =>{
        e.preventDefault()
        if([nombre, descripcion, cliente,fechaEntrega].includes('')){
            mostrarAlerta({
                msg: "Todos los campos son Obligatorios", 
                error: true
            });
            return
        }
        
        // Pasar datos al provider
        await submitProyecto({id,nombre, descripcion, fechaEntrega, cliente})

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

    const {msg} = alerta;

    return (
        <form 
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta}/>}

            <div className="mb-5">
                <label htmlFor="nombre" className='text-gray-700 uppercase font-bold text-sm'>Nombre Proyecto</label>
                <input 
                    type="text"
                    id='nombre'
                    placeholder='Nombre del proyecto'
                    className='border w-full p-2 mt-2 font-bold placeholder-gray-400 rounded-md'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="descripcion" className='text-gray-700 uppercase font-bold text-sm'>Descripción</label>
                <textarea 
                    id='descripcion'
                    placeholder='Descripcion del proyecto'
                    className='border w-full p-2 mt-2 font-bold placeholder-gray-400 rounded-md'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="fecha-entrega" className='text-gray-700 uppercase font-bold text-sm'>Fecha de Entrega</label>
                <input 
                    type="date"
                    id='fecha-entrega'
                    className='border w-full p-2 mt-2 font-bold placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="cliente" className='text-gray-700 uppercase font-bold text-sm'>Nombre del Cliente</label>
                <input 
                    type="text"
                    id='cliente'
                    placeholder='Nombre del cliente'
                    className='border w-full p-2 mt-2 font-bold placeholder-gray-400 rounded-md'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                />
            </div>

            <input 
                type="submit" 
                value={id ? "Actualizar Proyecto" : "Crear Proyecto"}
                className="bg-sky-600 w-full p-3 uppercase font-bold rounded text-white cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    )
}

export default FormularioProyecto