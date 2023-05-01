import axios from "axios";

//utilizar cliente axios para no tener que repetir muchas veces la misma url
const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
}) 

export default clienteAxios