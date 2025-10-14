import { Outlet } from 'react-router-dom';

function DefaultLayout() {
  return (
    <div className="min-h-screen h-full">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DefaultLayout;
