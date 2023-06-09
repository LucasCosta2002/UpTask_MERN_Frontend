import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [alerta, setAlerta] = useState({})

	const { setAuth } = useAuth();

	const navigate = useNavigate()

	const handleSubmit = async e =>{
		e.preventDefault()
		if ([email, password].includes("")) {
			setAlerta({
				msg: "Los campos son obligatorios",
				error: true
			})
			return
		}

		try {
			//comprobar que exista y este cofirmado para entrar
			const {data} = await clienteAxios.post("/usuarios/login", {email, password})
			setAlerta({})
			localStorage.setItem("token", data.token)
			setAuth(data)
			navigate("/proyectos")
		} catch (error) {
			setAlerta({
				msg: error.response.data.msg,
				error: true
			});
		}
	}

	const {msg} = alerta;

    return (
		<>
			<h1 className='text-sky-600 font-black text-5xl capitalize text-center'>Inicia sesión y administra tus<span className='text-slate-700'> proyectos</span></h1>

			{msg && <Alerta alerta={alerta}/>}
			<form 
				onSubmit={handleSubmit}
				className='my-10 bg-white shadow rounded-lg p-10'
			>
				<div className='my-5'>
					<label 
						htmlFor="email" 
						className='uppercase text-gray-600 block text-xl font-bold'>
						Email
					</label>
					<input 
						id='email' 
						type="email" 
						placeholder='Email de Registro' 
						className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className='my-5'>
					<label 
						htmlFor="password" 
						className='uppercase text-gray-600 block text-xl font-bold'>
						Contraseña
					</label>
					<input 
						id='password' 
						type="password" 
						placeholder='Contraseña de Registro' 
						className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<input 
					type="submit" 
					value={"Iniciar Sesión"} 
					className='bg-sky-700 w-full mb-5 py-3 uppercase font-bold text-white rounded hover: cursor-pointer hover:bg-sky-800 hover:transition-colors'

				/>
			</form>

			<nav className='lg:flex lg:justify-between'>
				<Link
					to={"/registrar"}
					className="block text-center my-5 text-slate-500 text-sm"
				>¿No tenés cuenta? Registrate
				</Link>
				<Link
					to={"/olvide-password"}
					className="block text-center my-5 text-slate-500 text-sm"
				>Olvidé mi Contraseña
				</Link>
			</nav>
		</>
	)
}

export default Login