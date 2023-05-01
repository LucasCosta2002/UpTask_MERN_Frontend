import {useParams, Link} from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';
import { useEffect } from 'react';
import ModalFormularioTarea from '../components/ModalFormularioTarea';
import Tarea from '../components/Tarea';
import ModalEliminarTarea from '../components/ModalEliminarTarea';
import Alerta from '../components/Alerta';
import Colaborador from '../components/Colaborador';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import useAdmin from '../hooks/useAdmin';
import io from 'socket.io-client'

let socket;

const Proyecto = () => {

	const params = useParams() //leer id 
	const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos()
	const {nombre} = proyecto;
	const admin = useAdmin()

	useEffect(()=>{
		obtenerProyecto(params.id)
	},[])

	useEffect(()=>{
		socket = io(import.meta.env.VITE_BACKEND_URL);
		socket.emit("abrir proyecto", params.id)
	},[])

	useEffect(() => {
		socket.on("tarea agregada", tareaNueva =>{
			if(tareaNueva.proyecto === proyecto._id){
				submitTareasProyecto(tareaNueva)
			}
		})
		
		socket.on("tarea eliminada", tareaEliminada =>{
			if(tareaEliminada.proyecto === proyecto._id){
				eliminarTareaProyecto(tareaEliminada)
			}
		})

		socket.on("tarea actualizada", tareaActualizada =>{
			if(tareaActualizada.proyecto._id === proyecto._id){
				actualizarTareaProyecto(tareaActualizada)
			}
		})

		socket.on("nuevo estado", nuevoEstadoTarea =>{
			if(nuevoEstadoTarea.proyecto._id === proyecto._id){
				cambiarEstadoTarea(nuevoEstadoTarea)
			}
		})
	})

	const {msg} = alerta

	return (

		cargando ? 
			<div className="border border-blue-300 shadow rounded-md p-4 max-w-4xl w-full mx-auto">
				<div className="animate-pulse flex space-x-4">
					<div className="rounded-full bg-slate-400 h-10 w-10"></div>
					<div className="flex-1 space-y-6 py-1">
						<div className="h-2 bg-slate-400 rounded"></div>
						<div className="space-y-3">
							<div className="grid grid-cols-3 gap-4">
								<div className="h-2 bg-slate-400 rounded col-span-2"></div>
								<div className="h-2 bg-slate-400 rounded col-span-1"></div>
							</div>
							<div className="h-2 bg-slate-400 rounded"></div>
						</div>
					</div>
				</div>
			</div> 
		: (
			<>
				<div className='flex justify-between'>
					<h1 className='font-black text-4xl'>{nombre}</h1>
					{admin && ( 
					<div  className='flex items-center gap-2 text-gray-400  hover:text-black'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
						</svg>
						<Link to={`/proyectos/editar/${params.id}`} className='uppercase font-bold'>Editar</Link>
					</div>
					)}
				</div>
				{admin && ( 
					<button
						type='button'
						className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'
						onClick={handleModalTarea}
					><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 	stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>Nueva Tarea
					</button>
				)}
				<p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

				<div className="bg-white shadow mt-10 rounded-lg ">
					{proyecto.tareas?.length ? 
						proyecto.tareas?.map(tarea => (
							<Tarea
								key={tarea._id}
								tarea={tarea}
							/>
						))
					:  
					(<p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>)}
				</div>

				{admin && ( 
					<>
						<div className="flex items-center mt-10 justify-between">
							<p className='font-bold text-xl	'>Colaboradores</p>
							<Link className='text-gray-400 uppercase font-bold hover:text-black' to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>Añadir</Link>
						</div>
						<div className="bg-white shadow mt-10 rounded-lg ">
							{proyecto.colaboradores?.length ? 
								proyecto.colaboradores?.map(colaborador => (
									<Colaborador
										key={colaborador._id}
										colaborador={colaborador}
									/>
								))
							:  
							(<p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>)}
						</div>
					</>
				)}

				<ModalFormularioTarea/>
				<ModalEliminarTarea/>
				<ModalEliminarColaborador />
			</>
		)
    )
}

export default Proyecto