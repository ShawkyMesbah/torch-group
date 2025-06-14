import { Suspense } from "react";

export default function AuthExamplesPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">أمثلة المصادقة</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">استخدام getServerSession</h2>
          <ServerAuthExample />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">أمثلة أخرى</h2>
          <div className="bg-yellow-50 p-4 rounded">تمت إزالة أمثلة AuthStatus و ProtectedContent بعد تنظيف المشروع.</div>
        </div>
      </div>
    </div>
  );
}

// مثال على استخدام getServerSession
async function ServerAuthExample() {
  // استيراد auth من lib/auth
  const { auth } = await import("@/lib/auth");
  // استخدام auth() للحصول على الجلسة
  const session = await auth();
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">بيانات الجلسة من الخادم</h3>
      {session ? (
        <div className="space-y-2">
          <p><strong>المستخدم:</strong> {session.user?.name || session.user?.email}</p>
          <p><strong>البريد الإلكتروني:</strong> {session.user?.email}</p>
          <p><strong>الدور:</strong> {session.user?.role}</p>
          <p><strong>المعرف:</strong> {session.user?.id}</p>
        </div>
      ) : (
        <p>أنت غير متصل - هذه البيانات من الخادم باستخدام getServerSession</p>
      )}
      <div className="mt-4 p-4 bg-slate-100 rounded-md">
        <h4 className="text-sm font-medium mb-2">كيفية الاستخدام:</h4>
        <pre className="text-xs overflow-auto p-2 bg-slate-800 text-white rounded">
          {`// مكون خادم (Server Component)
async function MyServerComponent() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (session) {
    return <p>مرحبًا {session.user.name}</p>;
  }
  return <p>أنت غير متصل</p>;
}`}
        </pre>
      </div>
    </div>
  );
} 