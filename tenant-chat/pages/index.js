import Link from "next/link";

import * as React from "react";
const document = "/TestData/tenantHero.pdf";

export default function Home() {
  return (
    <div>
      <nav>
        <ul class="flex">
          <li class="mr-6">
            <Link href="/" className="relative px-4 py-2">
              Home
            </Link>
          </li>
          <li class="mr-6">
            <Link href="/pdf" className="relative px-4 py-2">
              Pdf
            </Link>
          </li>
          <li class="mr-6">
            <Link href="/chat" className="relative px-4 py-2">
              Chat
            </Link>
          </li>
          <li class="mr-6">
            <Link href="/chatv2" className="relative px-4 py-2">
              Chatv2
            </Link>
          </li>
        </ul>
      </nav>
      <iframe
        src={document}
        width="100%"
        height="600px"
        loading="lazy"
        title="PDF-file"
      ></iframe>
    </div>
  );
}
