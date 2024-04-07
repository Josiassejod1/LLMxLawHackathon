import * as React from "react";
// import { readFolderContents } from "../components/viewfiles";
const document = "/TestData/California-Tenants-Guide.pdf";

export default function Pdf() {
  return (
    <div>
      <h1>About Us</h1>
      <p>
        We are a company that is dedicated to making the world a better place.
      </p>

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
