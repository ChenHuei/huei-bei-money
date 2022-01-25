/* eslint-disable @typescript-eslint/no-shadow */
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField } from '@mui/material';
import { AppOutletProps } from '@/App';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setSnackbarState, setIsOpenLoading } = useOutletContext<AppOutletProps>();
  const { control, handleSubmit, setValue } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onConfirm = (data: LoginForm): void => {
    const auth = getAuth();
    const { email, password } = data;
    setIsOpenLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/home');
      })
      .catch(() => {
        setSnackbarState({ open: true, message: '登入失敗' });
      })
      .finally(() => {
        setIsOpenLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-primaryLighter">
      <div className="bg-white p-4">
        <h1 className="text-3xl text-secondary font-bold">Huei Bei Money</h1>
        <p className="text-xl mt-4 mb-2s">👵🏻👴🏿</p>
        <form onSubmit={handleSubmit(onConfirm)}>
          <Controller
            name="email"
            control={control}
            rules={{ required: '請輸入帳號' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="email"
                label="信箱"
                margin="normal"
                value={value}
                error={!!error}
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
            rules={{ required: '請輸入密碼' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="password"
                type="password"
                label="帳號"
                margin="normal"
                value={value}
                error={!!error}
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('password', e.target.value)
                }
              />
            )}
          />
          <div className="h-12 mt-4">
            <Button
              type="submit"
              className="h-full"
              variant="contained"
              color="secondary"
              fullWidth
            >
              submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
export type { LoginForm };
