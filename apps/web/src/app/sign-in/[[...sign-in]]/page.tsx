import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center px-4 py-3">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white border border-gray-300 shadow-xl shadow-gold/10',
          },
        }}
      />
    </div>
  );
}
