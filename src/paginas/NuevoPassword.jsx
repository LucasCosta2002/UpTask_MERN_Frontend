import {useState, useEffect} from 'react'
import {Link, useParams} from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {

	const params = useParams()	
	const {token} = params;
	const [alerta, setAlerta] = useState({})
	const [tokenValido, setTokenValido] = useState(false)
	const [password, setPassword] = useState('')
	const [passwordModificado, setPasswordModificado] = useState(false)

	useEffect(() => {
		const comprobarToken = async ()=>{
			try {
				await clienteAxios(`/usuarios/olvide-password/${token}`)
				setTokenValido(true)
			} catch (error) {
				setAlerta({
					msg: error.response.data.msg,
					error: true
				})
			}
		}

		return ()=> {comprobarToken()}
	}, [])
	
	const {msg} = alerta;

	const handleSubmit = async e =>{
		e.preventDefault();
		if (password === '' || password.length < 6) {
			setAlerta({
				msg: "La contraseña debe tener al menos 6 caracteres",
				error: true
			})
			return
		}
		try {
			const url = `/usuarios/olvide-password/${token}`
			const {data} = await clienteAxios.post(url, {password})
			setAlerta({
				msg: data.msg,
				error: false
			})
			setPasswordModificado(true)
		} catch (error) {
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	}

	return (
        <>
			<h1 className='text-sky-600 font-black text-5xl capitalize text-center'>Reestablecé tu contraseña y no pierdas acceso a tus<span className='text-slate-700'> proyectos</span></h1>

			{msg && <Alerta alerta={alerta}/>}
			{tokenValido && (
				<form
					onSubmit={handleSubmit}
					className='my-10 bg-white shadow rounded-lg p-10'
				>
					<div className='my-5'>
						<label 
							htmlFor="password" 
							className='uppercase text-gray-600 block text-xl font-bold'>
							Nueva Contraseña
						</label>
						<input 
							id='password' 
							type="password" 
							placeholder='Nueva Contraseña' 
							className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>

					<input 
						type="submit" 
						value={"Guardar Contraseña"} 
						className='bg-sky-700 w-full mb-5 py-3 uppercase font-bold text-white rounded hover: cursor-pointer hover:bg-sky-800 hover:transition-colors'

					/>
				</form>
			)}

			{passwordModificado && 
				<Link
					to={"/"}
					className="block text-center my-5 text-slate-500 text-sm uppercase"
				>Iniciar Sesión
				</Link>
			}	

		</>
    )
}

export default NuevoPassword