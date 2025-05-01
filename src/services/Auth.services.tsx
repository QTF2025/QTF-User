import axiosInstance from '../utils/environment'

class Authservices{
    public async signIn(data: any){
        try {
            const response: any = await axiosInstance.post('/auth/signupOrLogin', data);
            console.log("veeru", response)
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default Authservices