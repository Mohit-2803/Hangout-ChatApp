import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import AuthSuccessToast from "@/components/auth/AuthSuccessToast";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthSuccessToast />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to your Dashboard! 🎉
            </h2>
            <p className="text-lg text-gray-600">
              Youre successfully authenticated and ready to start chatting.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Start Chatting
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Begin conversations with your friends and family.
              </p>
              <Button className="w-full" asChild>
                <Link href="/conversations">Open Chat</Link>
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Find Friends
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Discover and connect with new people.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/friends">Browse Users</Link>
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Settings
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Customize your profile and preferences.
              </p>
              <Button variant="outline" className="w-full">
                View Settings
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">📭</span>
                <p>
                  No recent activity yet. Start a conversation to see updates
                  here!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
