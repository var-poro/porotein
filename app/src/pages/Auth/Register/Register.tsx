import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRegister } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const registerMutation = useRegister();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await registerMutation.mutateAsync(data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" {...register('username', { required: true })} />
                {errors.username && <span>This field is required</span>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" {...register('email', { required: true })} />
                {errors.email && <span>This field is required</span>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" {...register('password', { required: true })} />
                {errors.password && <span>This field is required</span>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;