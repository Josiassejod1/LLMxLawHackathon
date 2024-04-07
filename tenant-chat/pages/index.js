import Link from "next/link";

import * as React from "react";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/pdf">About Us</Link>
      </li>
    </ul>
  );
}
