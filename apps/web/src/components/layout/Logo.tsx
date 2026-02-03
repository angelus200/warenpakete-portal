import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative transition-transform group-hover:scale-105">
        <Image src="/logo.svg" alt="E-Commerce Service" width={48} height={48} />
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">
          E-Commerce Service
        </span>
        <span className="text-xs text-gold-dark/70 font-medium tracking-wider">
          PREMIUM B2B
        </span>
      </div>
    </Link>
  );
}
