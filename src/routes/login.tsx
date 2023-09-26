import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Input,
  Switcher,
  Form,
  Title,
  Wrapper,
} from "../assets/styled-components/auth-components";
import GithubButton from "../components/github-btn";
import GoogleButton from "../components/google-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>환영합니다!</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          placeholder="Email"
          value={email}
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          placeholder="Password"
          autoComplete="off"
          value={password}
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "로그인중.." : "로그인"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        <Link to="/create-account">아직 계정이 없으신가요? </Link>
      </Switcher>
      <GithubButton />
      <GoogleButton />
    </Wrapper>
  );
}
