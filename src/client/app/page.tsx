import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>Hello APP!</h1>
      <Link href="/nested">NESTED</Link>
      <br />
      <Link href="/nested2">NESTED2</Link>
    </>
  );
}
