import { useQuery } from '@tanstack/react-query';
import useAuth from '../context/useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { firebaseUser, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isLoading: roleLoading, data: role = 'user' } = useQuery({
        queryKey: ['user-role', firebaseUser?.email],
        enabled: !loading && !!firebaseUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${firebaseUser.email}/role`);
            return res.data?.role || 'user';
        }
    })

    return { role, roleLoading };
};

export default useRole;
