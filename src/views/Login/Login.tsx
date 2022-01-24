import { Controller, useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField } from '@mui/material';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const { control, handleSubmit, setValue } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onConfirm = (data: LoginForm): void => {
    const { email, password } = data;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // ...
      })
      .catch((e) => {
        console.log('error', e);
      });
  };

  return (
    <div className="bg-white p-4">
      <h1 className="text-3xl text-secondary font-bold">Huei Bei Money</h1>
      <p className="text-xl mt-4 mb-2s">👵🏻👴🏿</p>
      <form onSubmit={handleSubmit(onConfirm)}>
        <Controller
          name="email"
          control={control}
          render={({ field: { value } }) => (
            <TextField
              id="email"
              label="信箱"
              margin="normal"
              value={value}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('email', e.target.value)
              }
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { value } }) => (
            <TextField
              id="password"
              type="password"
              label="帳號"
              margin="normal"
              value={value}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('password', e.target.value)
              }
            />
          )}
        />
        <div className="h-12 mt-4">
          <Button type="submit" className="h-full" variant="contained" color="secondary" fullWidth>
            submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
export type { LoginForm };
