import { auth } from "../utils/firebase";

export default function Home() {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <p>
      <button onClick={logOut}>로그아웃</button>
    </p>
  );
}
