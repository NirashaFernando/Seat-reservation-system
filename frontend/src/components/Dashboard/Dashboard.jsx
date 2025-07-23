import React from "react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-lg text-gray-600">
          Hello {user.name}! You are logged in as{" "}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {user.role}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🪑</span>
            <h3 className="text-xl font-semibold text-gray-900">
              View Seat Map
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Browse and reserve available seats
          </p>
          <a
            href="/seats"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Go to Seat Map
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📋</span>
            <h3 className="text-xl font-semibold text-gray-900">
              My Reservations
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            View your current and past reservations
          </p>
          <a
            href="/reservations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            View Reservations
          </a>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-yellow-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚙️</span>
              <h3 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage seats, users, and view reports
            </p>
            <a
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
            >
              Admin Dashboard
            </a>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Role:</span>
            <span className="text-gray-900 font-semibold">{user.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900 font-semibold">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
