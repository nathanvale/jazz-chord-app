import React from "react";
import { styled } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { Controller, useForm } from "react-hook-form";
import { useIdentityContext } from "react-netlify-identity";
import Alert from "@material-ui/core/Alert";
import LoadingButton from "@material-ui/lab/LoadingButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Stack from "@material-ui/core/Stack";
import Link from "@material-ui/core/Link";
import AlertTitle from "@material-ui/core/AlertTitle";
import { useLocation, useHistory } from "react-router-dom";

export const alertTitle = "Let's try that again";

interface FormData {
  email: string;
  password: string;
}

const CustomContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const Login = () => {
  const { loginUser } = useIdentityContext();
  const { handleSubmit, control } = useForm<FormData>();
  const [msg, setMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    setMsg("");
    return await loginUser(email, password)
      .then((user) => {
        setLoading(false);
        setRedirectToReferrer(true);
      })
      .catch((err) => {
        setMsg(err.message);
        setLoading(false);
      });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const loginProvider = React.useCallback((provider: any) => {
    const url = `https://www.nathanvale.com/.netlify/identity/authorize?provider=${provider}`;
    window.location.href = url;
  }, []);

  const click = () => loginProvider("google");
  const history = useHistory();

  const { state } = useLocation<{
    from: { pathname: string };
  }>();
  let { from } = state || { from: { pathname: "/" } };

  if (redirectToReferrer) {
    history.replace(from.pathname);
    setRedirectToReferrer(false);
    return null;
  }

  return (
    <CustomContainer maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {msg && (
            <Alert severity="error" variant="outlined">
              <AlertTitle>{alertTitle}</AlertTitle>
              {msg}
            </Alert>
          )}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email required",
              pattern: {
                message: "Invalid email address",
                value:
                  // eslint-disable-next-line no-useless-escape
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                id="email"
                label="Email"
                fullWidth
                variant="filled"
                value={value}
                disabled={loading}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                id="password"
                label="Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                variant="filled"
                value={value}
                onChange={onChange}
                disabled={loading}
                error={!!error}
                helperText={error ? error.message : null}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Link
                        sx={{ cursor: "pointer", userSelect: "none" }}
                        aria-label="Toggle password visibility"
                        onMouseDown={handleTogglePassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Link>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            fullWidth
          >
            Log in
          </LoadingButton>
          <button onClick={click}>Continue with Google</button>
        </Stack>
      </form>
    </CustomContainer>
  );
};
