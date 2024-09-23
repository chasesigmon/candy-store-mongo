import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>Hello NESTED!</h1>
      <Link href="/">APP</Link>
      <br />
      <Link href="/nested2">NESTED2</Link>
    </>
  );
}
