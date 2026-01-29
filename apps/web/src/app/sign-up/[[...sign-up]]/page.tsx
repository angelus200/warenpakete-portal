import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-dark-light border border-gold/20 shadow-xl shadow-gold/10',
          },
        }}
      />
    </div>
  );
}
