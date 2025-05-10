export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Pages</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Blog Posts</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Projects</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">New Messages</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Recent Activity</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y">
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm w-32">2 hours ago</span>
                <span>New blog post published: "The Future of Web Development"</span>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm w-32">5 hours ago</span>
                <span>Project "E-commerce Redesign" updated</span>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm w-32">1 day ago</span>
                <span>New contact message from John Smith</span>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm w-32">2 days ago</span>
                <span>Team member profile updated: "Sarah Johnson"</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700">
            Create New Page
          </button>
          <button className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700">
            Write Blog Post
          </button>
          <button className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700">
            Add New Project
          </button>
        </div>
      </div>
    </div>
  );
} 