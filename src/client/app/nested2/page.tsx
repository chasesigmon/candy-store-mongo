import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>Hello NESTED2!</h1>
      <Link href="/">APP</Link>
      <br />
      <Link href="/nested">NESTED</Link>
    </>
  );
}
