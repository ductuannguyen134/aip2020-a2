import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000'
})

export const axiosImgur = axios.create({
    baseURL: 'http://cors-anywhere.herokuapp.com'
})

export default instance;