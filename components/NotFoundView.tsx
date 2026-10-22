import Link from "next/link";
import { Tx } from "@/components/Tx";

export function NotFoundView() {
  return (
    <div className="page narrow">
      <p className="kicker">404</p>
      <h1>
        <Tx id="notfound.title" />
      </h1>
      <p className="lede">
        <Tx id="notfound.body" />
      </p>
      <Link href="/" className="btn">
        <Tx id="back" />
      </Link>
    </div>
  );
}
