import React, { useEffect } from 'react'
import useProyectos from '../hooks/useProyectos'
import PreviewProyecto from '../components/PreviewProyecto'
import Alerta from '../components/Alerta'
import io from 'socket.io-client'

let socket;

const Proyectos = () => {

    const {proyectos, alerta} = useProyectos()
    
    
    const{ msg } = alerta;
    return (
        <>
            <h1 className='text-4xl font-black'>Proyectos</h1>
          
            <div className="flex justify-center">
					<div className="md:w-1/3 lg:w-1/4">
						{msg && <Alerta alerta={alerta}/>}
					</div>
            </div>

            <div className='bg-white shadow mt-10 rounded-lg'>
                {proyectos.length ? 
                    proyectos?.map(proyecto => (
                        <PreviewProyecto 
                            key={proyecto._id}
                            proyecto={proyecto}
                        />
                    ))
                : <p className='text-center text-gray-600 uppercase  p-5'>No hay proyectos aun</p>}
            </div>
        </>
    )
}

export default Proyectos