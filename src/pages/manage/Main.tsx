import Sidebar from './Sidebar'
import Dashboard from './Dashboard'

const ManageIndex = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default ManageIndex
