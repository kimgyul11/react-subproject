import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h2>레이아웃</h2>
      <Outlet />
    </>
  );
}
