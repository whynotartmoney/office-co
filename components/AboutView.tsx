import { Tx } from "@/components/Tx";

const BMC = "https://buymeacoffee.com/whynotartmoney";

export function AboutView() {
  return (
    <div className="page narrow">
      <p className="kicker">office-co</p>
      <h1>
        <Tx id="about.title" />
      </h1>
      <div className="prose">
        <p>
          <Tx id="about.p1" />
        </p>
        <p>
          <Tx id="about.p2" />
        </p>
        <p>
          <Tx id="about.p3" />
        </p>
        <p>
          <Tx id="about.p4" />
        </p>
      </div>
      <a className="bmc" href={BMC} target="_blank" rel="noreferrer">
        <Tx id="bmc" />
      </a>
    </div>
  );
}
