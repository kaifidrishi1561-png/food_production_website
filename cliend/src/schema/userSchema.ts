//zod
import { z } from 'zod';

export const userSignupSchema = z.object({ 
    fullname: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(20, 'Password must be at most 20 characters long'),
    contact: z.string().min(10, 'Contact number must be at least 10 digits long'),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({ 
  
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;