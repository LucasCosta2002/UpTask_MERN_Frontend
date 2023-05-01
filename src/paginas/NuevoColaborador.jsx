import {useEffect} from 'react'
import FormularioColaborador from '../components/FormularioColaborador'
import useProyectos from '../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import Alerta from '../components/Alerta';



const NuevoColaborador = () => {
    
    const {obtenerProyecto, proyecto, cargando, colaborador,agregarColaborador, alerta} = useProyectos();
    const params = useParams()

    useEffect(()=>{
        obtenerProyecto(params.id)
    }, [])

	if(!proyecto?._id) return <Alerta alerta={alerta}/>
    return (
        cargando ?
			(<div className="border border-blue-300 shadow rounded-md p-4 max-w-4xl w-full mx-auto">
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
			</div> )
		: 
        (<>
            <h1 className='text-4xl font-black'>Añadir Colaborador/a al proyecto "{proyecto.nombre}"</h1>
            <div className="mt-10 flex justify-center">
                <FormularioColaborador/>
            </div>

			{cargando ? 'Cargando...' : colaborador?._id && (
				<div className="flex justify-center mt-10 ">
					<div className="bg-white py-10 px-5 md:w-full rounded-lg shadow">
						<h2 className='text-center mb-10 text-2xl font-bold'>Resultado</h2>
						<div className="flex justify-between items-center">
							<p>{colaborador.nombre}</p>

							<button
								type='button'
								onClick={()=> agregarColaborador({email: colaborador.email})}
								className='bg-slate-500 px-5 py-2 uppercase text-white font-bold text-sm rounded-lg'
							>Agregar Al Proyecto</button>
						</div>
					</div>
				</div>
			)}
        </>
        )
    )
}

export default NuevoColaborador