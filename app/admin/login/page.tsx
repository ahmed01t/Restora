import { Suspense } from 'react';
import AdminLogin from './login-form';
export default function LoginPage(){return <Suspense fallback={<main className="auth-page"/>}><AdminLogin/></Suspense>}
